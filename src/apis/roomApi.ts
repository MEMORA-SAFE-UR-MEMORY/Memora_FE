import { supabase } from "@src/lib/supabase";
import { DraftManager } from "@src/services/draftService";
import { memoryService, MemoryStore } from "@src/services/memoryService";
import { FrameSlot, SlotMemoryMap } from "@src/types/frame";
import { Item, RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import { Draft, Room, RoomDetail, RoomType } from "@src/types/room";
import { isTempId } from "@src/utils/idGenerator";

export async function fetchRoomById(
  roomId: number
): Promise<RoomDetail | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      `
      id,
      room_name,
      theme_id,
      user_id,
      door_id,
      type,
      created_at,
      room_items (
        id,
        pos_x,
        pos_y,
        z_index,
        rotation,
        created_at,
        updated_at,
        items: item_id (
          id,
          name,
          puzzle_price,
          category_id,
          item_image_path,
          type,
          theme_id,
          created_at,
          dimension: dimension_id (
            id,
            w,
            h
          ),
          frame_slots (
            id,
            slot_id,
            x,
            y,
            w,
            h,
            rotation,
            shape
          )
        ),
        slot_memories (
          id,
          memory_id,
          room_item_id,
          frame_slot_id
        )
      ),
      memories (
        id,
        title,
        file_path,
        description,
        date,
        created_at
      )
    `
    )
    .eq("id", roomId)
    .single();

  if (error) throw error;
  if (!data) return null;

  const room: RoomDetail = {
    id: data.id,
    themeId: data.theme_id,
    roomName: data.room_name,
    userId: data.user_id,
    doorId: data.door_id,
    type: data.type,
    createdAt: data.created_at,
    theme: {} as any,
    items: (data.room_items ?? []).map((ri: any): RoomItem => {
      const item: Item = {
        id: ri.items.id,
        name: ri.items.name,
        puzzlePrice: ri.items.puzzle_price,
        categoryId: ri.items.category_id,
        type: ri.items.type,
        imageUrl: ri.items.item_image_path,
        themeId: ri.items.theme_id,
        createdAt: ri.items.created_at,
        dimension: {
          id: ri.items.dimension.id,
          w: ri.items.dimension.w,
          h: ri.items.dimension.h,
        },
        slots: (ri.items.frame_slots ?? []).map(
          (fs: any): FrameSlot => ({
            id: fs.id,
            slotId: fs.slot_id,
            x: fs.x,
            y: fs.y,
            w: fs.w,
            h: fs.h,
            rotation: fs.rotation,
            shape: fs.shape,
          })
        ),
      };

      // Ánh xạ slot_memories theo room_item_id
      const slotMemories: SlotMemoryMap = {};
      for (const fs of ri.items.frame_slots ?? []) {
        const memory = ri.slot_memories?.find(
          (s: any) => s.frame_slot_id === fs.slot_id
        );
        slotMemories[fs.slot_id] = memory?.memory_id ?? null;
      }

      return {
        id: ri.id,
        x: ri.pos_x,
        y: ri.pos_y,
        zIndex: ri.z_index,
        rotation: ri.rotation,
        item,
        slotMemories,
      };
    }),
  };

  // Nếu public room → map thêm memories
  if (room.type.toLowerCase() === "public") {
    room.memories = (data.memories ?? []).map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      image: m.file_path,
      date: m.date,
      createdAt: m.created_at,
    }));
  } else {
    // private → load local memory
    const localStore = await memoryService.loadStore(room.id);
    for (const item of room.items) {
      const localMap = localStore[item.id];
      if (localMap) {
        if (!item.slotMemories) item.slotMemories = {};
        for (const [slotId, mem] of Object.entries(localMap)) {
          item.slotMemories[Number(slotId)] = mem.id;
        }
      }
    }
  }

  return room;
}

export async function updateRoomTypeApi(
  roomId: number,
  type: RoomType
): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .update({ type })
    .eq("id", roomId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const saveRoomToSupabase = async (
  room: RoomDetail,
  draft: Draft,
  initialType: RoomType
) => {
  const appliedRoom = DraftManager.applyDraft(room, draft);
  const roomId = room.id;

  // Track rollback
  const createdItemIds: number[] = [];
  const createdMemoryIds: number[] = [];
  const createdSlotIds: number[] = [];

  try {
    // 0. Nếu từ public → private thì xóa hết memories
    if (initialType === "public" && room.type === "private") {
      const { data: slots, error: slotErr } = await supabase
        .from("slot_memories")
        .select(
          `
      id,
      memory_id,
      room_items!inner(id, room_id)
    `
        )
        .eq("room_items.room_id", roomId);
      if (slotErr) throw slotErr;

      const memIds = slots.map((s) => s.memory_id).filter((id) => id != null);

      if (memIds.length > 0) {
        await supabase.from("memories").delete().in("id", memIds);
      }

      await memoryService.resetMemoryIds(roomId);
    }

    // 1. Handle remove items
    const removeOps = (draft.patches as any[]).filter((p) => {
      const op = p?.op?.toString?.() ?? "";
      return op === "removeItem" && p.itemId != null;
    });

    if (removeOps.length > 0) {
      type DbItem = { id: number; item: { category_id: number } };
      const removeIds = removeOps.map((p) => p.itemId);

      // Lấy danh sách room_items trong DB để biết item nào là frame
      const { data: dbItems, error: dbItemErr } = await supabase
        .from("room_items")
        .select("id, item:items(category_id)")
        .in("id", removeIds)
        .returns<DbItem[]>();

      if (dbItemErr) throw dbItemErr;

      for (const dbIt of dbItems ?? []) {
        const roomItemId = dbIt.id;
        const isFrame = dbIt.item?.category_id === 1;

        if (isFrame) {
          // 1. Xóa slot_memories liên quan
          const { data: slots, error: slotErr } = await supabase
            .from("slot_memories")
            .select("id, memory_id")
            .eq("room_item_id", roomItemId);

          if (slotErr) throw slotErr;

          if (slots && slots.length > 0) {
            const slotIds = slots.map((s) => s.id);
            await supabase.from("slot_memories").delete().in("id", slotIds);

            // Nếu room public thì xóa luôn memories
            if (room.type === "public") {
              const memIds = slots
                .map((s) => s.memory_id)
                .filter((id) => id != null);
              if (memIds.length > 0) {
                await supabase.from("memories").delete().in("id", memIds);
              }
            }
          }
        }

        // 2. Xóa room_item cuối cùng
        await supabase.from("room_items").delete().eq("id", roomItemId);
      }
    }
    // 2. Xử lý room_items
    const tempItems = appliedRoom.items.filter((it) => isTempId(it.id));
    const persistedItems = appliedRoom.items.filter((it) => !isTempId(it.id));

    // INSERT items mới
    let insertedItems: { id: number }[] = [];
    if (tempItems.length > 0) {
      const insertPayloads = tempItems.map((it) => ({
        pos_x: it.x,
        pos_y: it.y,
        z_index: it.zIndex,
        rotation: it.rotation ?? 0,
        room_id: roomId,
        item_id: it.item.id,
      }));
      const { data, error } = await supabase
        .from("room_items")
        .insert(insertPayloads)
        .select("id");
      if (error) throw error;
      insertedItems = data;
    }

    // UPSERT items cũ
    if (persistedItems.length > 0) {
      const upsertPayloads = persistedItems.map((it) => ({
        id: it.id,
        pos_x: it.x,
        pos_y: it.y,
        z_index: it.zIndex,
        rotation: it.rotation ?? 0,
        room_id: roomId,
        item_id: it.item.id,
      }));
      const { error } = await supabase
        .from("room_items")
        .upsert(upsertPayloads, { onConflict: "id" });
      if (error) throw error;
    }

    // Map id tạm sang id thật
    const itemIdMap: Record<number, number> = {};
    let insertIdx = 0;
    for (const it of appliedRoom.items) {
      if (isTempId(it.id)) {
        const newId = insertedItems[insertIdx++].id;
        itemIdMap[it.id] = newId;
        createdItemIds.push(newId);
      } else {
        itemIdMap[it.id] = it.id;
      }
    }

    if (appliedRoom.type === "private") {
      try {
        await memoryService.updateStoreIds(roomId, itemIdMap);
      } catch (e) {
        console.warn("⚠️ Failed to update localStore item IDs:", e);
      }
    }

    // 2. Handle memories
    let memoryIdMap: Record<number, number> = {};
    if (appliedRoom.type === "public") {
      const localStore = await memoryService.loadStore(roomId);

      const allMemories: Memory[] = [];
      Object.values(localStore).forEach((slotMap) => {
        Object.values(slotMap).forEach((m) => allMemories.push(m));
      });

      const tempMems = allMemories.filter((m) => isTempId(m.id));
      const persistedMems = allMemories.filter((m) => !isTempId(m.id));

      // INSERT memories mới
      let insertedMems: { id: number }[] = [];
      if (tempMems.length > 0) {
        const insertPayloads = tempMems.map((m) => ({
          title: m.title,
          description: m.description,
          file_path: null,
          date: m.date,
          room_id: roomId,
          created_at: m.createdAt,
        }));
        const { data, error } = await supabase
          .from("memories")
          .insert(insertPayloads)
          .select("id");
        if (error) throw error;
        insertedMems = data;
      }

      // UPSERT memories cũ
      if (persistedMems.length > 0) {
        const upsertPayloads = persistedMems.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          file_path: m.image ?? null,
          date: m.date,
          room_id: roomId,
        }));
        const { error } = await supabase
          .from("memories")
          .upsert(upsertPayloads, { onConflict: "id" });
        if (error) throw error;
      }

      // 2. Map id
      let memInsertIdx = 0;
      for (const m of allMemories) {
        if (isTempId(m.id)) {
          const newId = insertedMems[memInsertIdx++].id;
          memoryIdMap[m.id] = newId;
          createdMemoryIds.push(newId);
        } else {
          memoryIdMap[m.id] = m.id;
        }
      }

      // 3. Upload ảnh qua API backend (nếu có ảnh)
      for (const m of allMemories) {
        const dbId = memoryIdMap[m.id];
        if (
          m.image &&
          typeof m.image === "string" &&
          !m.image.startsWith("http")
        ) {
          const formData = new FormData();
          formData.append("photo", {
            uri: m.image,
            name: `memory_${dbId}.jpg`,
            type: "image/jpeg",
          } as any);

          try {
            await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/api/Memory/upload-1-photo?id=${dbId}`,
              {
                method: "PUT",
                body: formData,
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          } catch (err) {
            console.warn(`⚠️ Upload failed for memory #${dbId}`, err);
          }
        }

        await memoryService.updateMemoryIds(roomId, memoryIdMap);

        // 4. Cập nhật lại local store với id thật
        const newStore: MemoryStore = {};
        Object.entries(localStore).forEach(([roomItemId, slotMap]) => {
          const updatedSlotMap: Record<number, Memory> = {};
          Object.entries(slotMap).forEach(([slotId, m]) => {
            const dbId = memoryIdMap[m.id] ?? m.id;
            updatedSlotMap[+slotId] = { ...m, id: dbId };
          });
          newStore[+roomItemId] = updatedSlotMap;
        });
        await memoryService.saveStore(roomId, newStore);
      }
    }

    // 3. Handle slot_memories
    const slotPayloads: any[] = [];
    for (const it of appliedRoom.items) {
      if (!it.slotMemories) continue;
      Object.entries(it.slotMemories).forEach(([slotId, memId]) => {
        const finalMemId =
          appliedRoom.type === "public" && memId != null
            ? (memoryIdMap[memId] ?? memId)
            : null;

        slotPayloads.push({
          room_item_id: itemIdMap[it.id],
          frame_slot_id: Number(slotId),
          memory_id: finalMemId,
        });
      });
    }

    if (slotPayloads.length > 0) {
      const { data: slotData, error: slotErr } = await supabase
        .from("slot_memories")
        .upsert(slotPayloads, { onConflict: "room_item_id,frame_slot_id" })
        .select("id");
      if (slotErr) throw slotErr;
      slotData.forEach((s) => createdSlotIds.push(s.id));
    }

    // 4. Clear draft
    await DraftManager.clearDraft(roomId);

    return { success: true, roomId, memoryIdMap };
  } catch (err) {
    console.error("Save failed, rolling back…", err);

    // Rollback theo thứ tự ngược lại
    if (createdSlotIds.length > 0) {
      await supabase.from("slot_memories").delete().in("id", createdSlotIds);
    }
    if (createdMemoryIds.length > 0) {
      await supabase.from("memories").delete().in("id", createdMemoryIds);
    }
    if (createdItemIds.length > 0) {
      await supabase.from("room_items").delete().in("id", createdItemIds);
    }

    throw err;
  }
};

export const fetchPublicRooms = async (userId: string) => {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      `
      id,
      type,
      theme_id,
      user_themes:theme_id (
      id,
      theme_id
    )
    `
    )
    .eq("type", "public") // lọc type = public
    .neq("user_id", userId); // loại bỏ room của user hiện tại

  if (error) {
    console.error("Lỗi khi lấy room:", error.message);
    return [];
  }

  return data;
};

export const suggestDescription = async (formData: FormData) => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/Memory/suggest-description`,
    {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lỗi server (${res.status}): ${text}`);
  }

  return res.json();
};

export const deleteMemory = async (memoryId: number) => {
  try {
    // 1. Xóa liên kết trong bảng slot_memories
    const { error: slotError } = await supabase
      .from("slot_memories")
      .delete()
      .eq("memory_id", memoryId);

    if (slotError) throw slotError;

    // 2. Xóa bản ghi trong bảng memories
    const { error: memoryError } = await supabase
      .from("memories")
      .delete()
      .eq("id", memoryId);

    if (memoryError) throw memoryError;

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting memory:", error.message);
    return { success: false, error: error.message };
  }
};

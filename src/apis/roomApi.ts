import { supabase } from "@src/lib/supabase";
import { DraftManager } from "@src/services/draftService";
import { memoryService, MemoryStore } from "@src/services/memoryService";
import { FrameSlot, SlotMemoryMap } from "@src/types/frame";
import { Item, RoomItem } from "@src/types/item";
import { Memory } from "@src/types/memory";
import { Draft, Room, RoomDetail, RoomType } from "@src/types/room";

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
            shape,
            slot_memories (
              id,
              memory_id
            )
          )
        )
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

      // slotMemories luôn có {slotId: memoryId | null}
      const slotMemories: SlotMemoryMap = {};
      for (const fs of ri.items.frame_slots ?? []) {
        const sm = fs.slot_memories?.[0]; // mỗi slot 1 bản ghi
        slotMemories[fs.slot_id] = sm?.memory_id ?? null;
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

export const saveRoomToSupabase = async (room: RoomDetail, draft: Draft) => {
  const appliedRoom = DraftManager.applyDraft(room, draft);
  const roomId = room.id;

  // Track rollback
  const createdItemIds: number[] = [];
  const createdMemoryIds: number[] = [];
  const createdSlotIds: number[] = [];

  try {
    // Remove
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
        console.log("roomItemId ", roomItemId);
        await supabase.from("room_items").delete().eq("id", roomItemId);
      }
    }
    // 1. Upsert room_items
    const { data: insertedItems, error: itemErr } = await supabase
      .from("room_items")
      .upsert(
        appliedRoom.items.map((it) => ({
          id: it.id > 0 ? it.id : undefined,
          pos_x: it.x,
          pos_y: it.y,
          z_index: it.zIndex,
          rotation: it.rotation ?? 0,
          room_id: roomId,
          item_id: it.item.id,
        })),
        { onConflict: "id" }
      )
      .select("id");

    if (itemErr) throw itemErr;

    const itemIdMap: Record<number, number> = {};
    appliedRoom.items.forEach((it, idx) => {
      itemIdMap[it.id] = insertedItems[idx].id;
      if (it.id < 0) createdItemIds.push(insertedItems[idx].id); // track những cái mới
    });

    // 2. Handle memories
    let memoryIdMap: Record<number, number> = {};
    if (appliedRoom.type === "public") {
      const localStore = await memoryService.loadStore(roomId);

      const allMemories: Memory[] = [];
      Object.values(localStore).forEach((slotMap) => {
        Object.values(slotMap).forEach((m) => allMemories.push(m));
      });

      if (allMemories.length > 0) {
        const memPayloads = allMemories.map((m) => ({
          id: m.id > 0 ? m.id : undefined,
          title: m.title,
          description: m.description,
          file_path: m.image,
          date: m.date,
          room_id: roomId,
          created_at: m.createdAt,
        }));

        const { data: memData, error: memErr } = await supabase
          .from("memories")
          .upsert(memPayloads, { onConflict: "id" })
          .select("id, title, description, file_path, date, created_at");
        if (memErr) throw memErr;

        allMemories.forEach((m, i) => {
          memoryIdMap[m.id] = memData[i].id;
          if (m.id < 0) createdMemoryIds.push(memData[i].id); // track id mới
        });

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
        .upsert(slotPayloads, { onConflict: "id" })
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

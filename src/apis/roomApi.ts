import { supabase } from "@src/lib/supabase";
import { DraftManager } from "@src/services/draftService";
import { memoryService } from "@src/services/memoryService";
import { Memory } from "@src/types/memory";
import { Draft, Room, RoomDetail, RoomType } from "@src/types/room";

export async function fetchRoomById(roomId: number): Promise<Room | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, room_name, theme_id, user_id, door_id, type, created_at")
    .eq("id", roomId)
    .single();

  if (error) throw error;
  if (!data) return null;

  const room: Room = {
    id: data.id,
    themeId: data.theme_id,
    roomName: data.room_name,
    userId: data.user_id,
    doorId: data.door_id,
    type: data.type,
    createdAt: data.created_at,
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

  // 1. Upsert room_items
  const { data: insertedItems, error: itemErr } = await supabase
    .from("room_items")
    .upsert(
      appliedRoom.items.map((it) => ({
        id: it.id > 0 ? it.id : undefined, // nếu id < 0 thì là localId (temp), Supabase sẽ tự tạo
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

  // map FE roomItemId → DB room_item.id
  const itemIdMap: Record<number, number> = {};
  appliedRoom.items.forEach((it, idx) => {
    itemIdMap[it.id] = insertedItems[idx].id;
  });

  // 2. Handle memories
  let memoryIdMap: Record<number, number> = {};
  if (appliedRoom.type === "public") {
    const localStore = await memoryService.loadStore(roomId);

    const memPayloads = Object.values(localStore).map((m) => ({
      title: m.title,
      description: m.description,
      file_path: m.image,
      date: m.date,
      room_id: roomId,
      created_at: m.createdAt,
    }));

    if (memPayloads.length > 0) {
      const { data: memData, error: memErr } = await supabase
        .from("memories")
        .upsert(memPayloads, { onConflict: "id" })
        .select("id, title, description, file_path, date, created_at");
      if (memErr) throw memErr;

      // build localId → dbId map
      const localMemories = Object.values(localStore);
      memoryIdMap = {};
      localMemories.forEach((m, i) => {
        memoryIdMap[m.id] = memData[i].id;
      });

      // update FE store để dùng id thật
      const newStore: Record<number, Memory> = {};
      localMemories.forEach((m, i) => {
        newStore[memData[i].id] = { ...m, id: memData[i].id };
      });
      await memoryService.saveStore(roomId, newStore);
    }
  }

  // 3. Handle slot_memories
  const slotPayloads: any[] = [];
  appliedRoom.items.forEach((it) => {
    if (!it.slotMemories) return;
    Object.entries(it.slotMemories).forEach(([slotId, memId]) => {
      if (memId == null) return;

      const finalMemId =
        appliedRoom.type === "public" ? memoryIdMap[memId] : memId;

      slotPayloads.push({
        room_item_id: itemIdMap[it.id],
        frame_slot_id: Number(slotId), // FE slotId ↔ DB frame_slots.slot_id
        memory_id: finalMemId,
      });
    });
  });

  if (slotPayloads.length > 0) {
    const { error: slotErr } = await supabase
      .from("slot_memories")
      .upsert(slotPayloads, { onConflict: "room_item_id,frame_slot_id" });
    if (slotErr) throw slotErr;
  }

  // 4. Clear draft
  await DraftManager.clearDraft(roomId);

  return { success: true, roomId, memoryIdMap };
};

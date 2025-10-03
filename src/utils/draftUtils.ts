import { Draft, RoomDetail } from "@src/types/room";

/**
 * Kiểm tra draft có rỗng hay không
 */
export function isDraftEmpty(draft?: Draft | null): boolean {
  return !draft || !draft.patches || draft.patches.length === 0;
}

/**
 * Kiểm tra draft có thay đổi so với room không
 */
export function isDraftChanged(
  initialRoom: RoomDetail,
  draft?: Draft | null
): boolean {
  if (!draft) return false;
  if (isDraftEmpty(draft)) return false;

  // Nếu có bất kỳ patch nào thì coi như có thay đổi
  return draft.patches.length > 0;
}

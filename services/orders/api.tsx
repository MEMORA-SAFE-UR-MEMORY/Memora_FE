import { CreateOrderPayload } from "./type";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createOrder(payload: CreateOrderPayload) {
  if (!BASE_URL) throw new Error("Thiếu EXPO_PUBLIC_API_URL");
  try {
    console.log("[OrderAPI] POST /api/Order/create payload:", payload);
    const res = await fetch(`${BASE_URL}/api/Order/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[OrderAPI] Non-2xx response:", res.status, text);
      throw new Error(text || `Tạo đơn hàng thất bại (${res.status})`);
    }
    try {
      const json = await res.json();
      console.log("[OrderAPI] Response JSON:", json);
      return json;
    } catch (e) {
      console.warn("[OrderAPI] Response not JSON or parse failed:", e);
      return null;
    }
  } catch (e: any) {
    console.error("[OrderAPI] createOrder error:", e?.message || e);
    throw e;
  }
}

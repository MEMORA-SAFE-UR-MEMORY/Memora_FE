import { useCallback, useState } from "react";
import { markAlbumsOrdered } from "services/album/api";
import { getUserIdFromStorage } from "services/album/hook";
import { ORDERED_ALBUMS_EVENT, orderEvents } from "../events/orderEvents";
import { createOrder } from "./api";
import { OrderAlbumInput } from "./type";

export function useCreateOrder() {
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(
    async (params: {
      fullName: string;
      address: string;
      phone: string;
      orderAlbums: OrderAlbumInput[];
      totalPrice: number;
    }) => {
      const userId = await getUserIdFromStorage();
      if (!userId) throw new Error("Không tìm thấy userId trong máy");

      setSubmitting(true);
      try {
        const orderRes = await createOrder({
          status: "Đã đặt",
          totalPrice: params.totalPrice,
          userId,
          fullname: params.fullName,
          phoneNumber: params.phone,
          address: params.address,
          orderAlbums: params.orderAlbums,
        });
        const albumIds = params.orderAlbums.map((a) => a.albumId);
        if (albumIds.length) {
          orderEvents.emit(ORDERED_ALBUMS_EVENT, albumIds);
          markAlbumsOrdered(albumIds).catch(() => {});
        }
        return orderRes;
      } catch (e: any) {
        throw e;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  return { submitting, submit };
}

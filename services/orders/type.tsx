export type OrderAlbumInput = {
  albumId: number;
  quantity: number;
  price: number;
  type?: "ONLINE" | "PHYSICAL"; // added type field
};

export type CreateOrderPayload = {
  status: string; // "Đã đặt"
  totalPrice: number;
  userId: string; // UUID
  fullname: string;
  phoneNumber: string;
  address: string;
  orderAlbums: OrderAlbumInput[];
};

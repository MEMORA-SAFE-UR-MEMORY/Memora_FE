export type RealItem = {
  id: string;
  categoryId: number;
  name: string;
  url: string;
};

export type EmptyItem = {
  id: string;
  empty: true;
};

export type Item = RealItem | EmptyItem;

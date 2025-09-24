export type Category = {
  id: number;
  name: string;
  createdAt: string;
};

export type CategoryWithIcon = Category & {
  iconPackage: string;
  iconName: string;
};

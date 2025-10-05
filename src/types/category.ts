export type Category = {
  id: number;
  name: string;
};

export type CategoryWithIcon = Category & {
  iconPackage: string;
  iconName: string;
};

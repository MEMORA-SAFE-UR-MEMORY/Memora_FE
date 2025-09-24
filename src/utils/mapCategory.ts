import { categoryIcon } from "@src/config/categoryIcon";
import { Category, CategoryWithIcon } from "@src/types/category";

export function mapCategoryWithIcon(category: Category): CategoryWithIcon {
  return {
    ...category,
    ...categoryIcon[category.id],
  };
}

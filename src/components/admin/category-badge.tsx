import type { Category, CategoryId } from "@/data/types";

export function CategoryPill({
  category,
}: {
  category: Category | undefined;
}) {
  if (!category) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: category.tint, color: category.base }}
    >
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: category.base }}
      />
      {category.label}
    </span>
  );
}

export function buildCategoryMap(
  categories: Category[]
): Record<string, Category> {
  return categories.reduce(
    (acc, c) => {
      acc[c.id] = c;
      return acc;
    },
    {} as Record<CategoryId | string, Category>
  );
}

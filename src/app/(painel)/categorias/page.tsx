export const dynamic = "force-dynamic";

import { getCategories, getPlaces } from "@/lib/store";
import { PageHeader } from "@/components/admin/page-header";
import { CategoriesEditor } from "@/components/admin/categories-editor";

export default async function CategoriasPage() {
  const [categories, places] = await Promise.all([
    getCategories(),
    getPlaces(),
  ]);
  const counts = categories.reduce(
    (acc, c) => {
      acc[c.id] = places.filter((p) => p.category === c.id).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <>
      <PageHeader
        title="Categorias"
        description="As 10 categorias do app — rótulo, ícone (Ionicons) e cores de cada uma."
      />
      <CategoriesEditor categories={categories} counts={counts} />
    </>
  );
}

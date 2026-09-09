export const dynamic = "force-dynamic";

import { getCategories } from "@/lib/store";
import { PlaceForm } from "@/components/admin/place-form";

export default async function NovoLocalPage() {
  const categories = await getCategories();
  return <PlaceForm categories={categories} isNew />;
}

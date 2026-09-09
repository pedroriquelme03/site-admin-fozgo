export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getPlace, getCategories } from "@/lib/store";
import { PlaceForm } from "@/components/admin/place-form";

export default async function EditarLocalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [place, categories] = await Promise.all([
    getPlace(id),
    getCategories(),
  ]);
  if (!place) notFound();
  return <PlaceForm place={place} categories={categories} isNew={false} />;
}

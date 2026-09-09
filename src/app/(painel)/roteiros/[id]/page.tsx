export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getItinerary, getPlaces } from "@/lib/store";
import { ItineraryForm } from "@/components/admin/itinerary-form";

export default async function EditarRoteiroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [itinerary, places] = await Promise.all([
    getItinerary(id),
    getPlaces(),
  ]);
  if (!itinerary) notFound();
  return <ItineraryForm itinerary={itinerary} places={places} isNew={false} />;
}

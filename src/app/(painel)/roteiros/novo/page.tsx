export const dynamic = "force-dynamic";

import { getPlaces } from "@/lib/store";
import { ItineraryForm } from "@/components/admin/itinerary-form";

export default async function NovoRoteiroPage() {
  const places = await getPlaces();
  return <ItineraryForm places={places} isNew />;
}

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";

import { getItineraries, getPlaces } from "@/lib/store";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { ItinerariesList } from "@/components/admin/itineraries-list";

export default async function RoteirosPage() {
  const [itineraries, places] = await Promise.all([
    getItineraries(),
    getPlaces(),
  ]);
  const placeName = places.reduce(
    (acc, p) => {
      acc[p.id] = p.name;
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <>
      <PageHeader
        title="Roteiros"
        description={`${itineraries.length} roteiros curados para os turistas.`}
        actions={
          <Button asChild>
            <Link href="/roteiros/novo">
              <Plus className="h-4 w-4" />
              Novo roteiro
            </Link>
          </Button>
        }
      />
      <ItinerariesList itineraries={itineraries} placeName={placeName} />
    </>
  );
}

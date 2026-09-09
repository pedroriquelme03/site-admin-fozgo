export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";

import { getPlaces, getCategories } from "@/lib/store";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { PlacesTable } from "@/components/admin/places-table";

export default async function LocaisPage() {
  const [places, categories] = await Promise.all([
    getPlaces(),
    getCategories(),
  ]);

  return (
    <>
      <PageHeader
        title="Locais"
        description={`${places.length} locais no app — restaurantes, atrações, hotéis, passeios e mais.`}
        actions={
          <Button asChild>
            <Link href="/locais/novo">
              <Plus className="h-4 w-4" />
              Novo local
            </Link>
          </Button>
        }
      />
      <PlacesTable places={places} categories={categories} />
    </>
  );
}

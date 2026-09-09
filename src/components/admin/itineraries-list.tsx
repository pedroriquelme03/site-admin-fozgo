"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, MapPin, Pencil, Trash2 } from "lucide-react";

import type { Itinerary } from "@/data/types";
import { deleteItineraryAction } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ItinerariesList({
  itineraries,
  placeName,
}: {
  itineraries: Itinerary[];
  placeName: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(it: Itinerary) {
    if (!confirm(`Excluir o roteiro "${it.title}"?`)) return;
    setDeletingId(it.id);
    startTransition(async () => {
      await deleteItineraryAction(it.id);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {itineraries.map((it) => (
        <Card key={it.id} className="flex flex-col overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ backgroundColor: it.tint }}
          >
            <div className="min-w-0">
              <p className="truncate font-semibold" style={{ color: it.color }}>
                {it.title}
              </p>
              <p
                className="truncate text-xs"
                style={{ color: it.color, opacity: 0.8 }}
              >
                {it.subtitle}
              </p>
            </div>
            <Badge
              style={{
                backgroundColor: it.color,
                color: "#fff",
                borderColor: "transparent",
              }}
            >
              {it.tag}
            </Badge>
          </div>
          <CardContent className="flex flex-1 flex-col gap-3 p-5">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {it.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {it.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {it.stops.length} paradas
              </span>
            </div>
            <ol className="space-y-1 text-sm">
              {it.stops.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-11 shrink-0 tabular-nums text-muted-foreground">
                    {s.time}
                  </span>
                  <span className="min-w-0 truncate">
                    {placeName[s.placeId] ?? s.placeId}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-auto flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/roteiros/${it.id}`}>
                  <Pencil className="h-4 w-4" /> Editar
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                disabled={pending && deletingId === it.id}
                onClick={() => handleDelete(it)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {itineraries.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum roteiro cadastrado.
        </p>
      )}
    </div>
  );
}

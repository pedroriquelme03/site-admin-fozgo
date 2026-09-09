"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2, GripVertical } from "lucide-react";

import type { Itinerary, ItineraryStop, Place } from "@/data/types";
import { upsertItineraryAction } from "@/lib/actions";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function emptyItinerary(firstPlaceId: string): Itinerary {
  return {
    id: "",
    title: "",
    subtitle: "",
    description: "",
    duration: "6h",
    tag: "",
    icon: "sparkles",
    color: "#0EA5B7",
    tint: "#E1F5F7",
    coverPlaceId: firstPlaceId,
    stops: [],
  };
}

export function ItineraryForm({
  itinerary,
  places,
  isNew,
}: {
  itinerary?: Itinerary;
  places: Place[];
  isNew: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState<Itinerary>(
    itinerary ?? emptyItinerary(places[0]?.id ?? "")
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Itinerary>(k: K, v: Itinerary[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function updateStop(i: number, patch: Partial<ItineraryStop>) {
    const next = [...data.stops];
    next[i] = { ...next[i], ...patch };
    set("stops", next);
  }

  function submit() {
    setError(null);
    if (!data.title.trim()) {
      setError("O título é obrigatório.");
      return;
    }
    const id = data.id || slugify(data.title);
    const clean: Itinerary = {
      ...data,
      id,
      coverPlaceId: data.coverPlaceId || data.stops[0]?.placeId || "",
      stops: data.stops.filter((s) => s.placeId),
    };
    startTransition(async () => {
      await upsertItineraryAction(clean);
      router.push("/roteiros");
      router.refresh();
    });
  }

  return (
    <div className="pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/roteiros")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold sm:text-2xl">
          {isNew ? "Novo roteiro" : data.title || "Editar roteiro"}
        </h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block">Título</Label>
                <Input
                  value={data.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Um dia em Foz"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Subtítulo</Label>
                <Input
                  value={data.subtitle}
                  onChange={(e) => set("subtitle", e.target.value)}
                  placeholder="O clássico completo"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Descrição</Label>
              <Textarea
                rows={3}
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <Label className="mb-1.5 block">Duração</Label>
                <Input
                  value={data.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="10h"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Tag</Label>
                <Input
                  value={data.tag}
                  onChange={(e) => set("tag", e.target.value)}
                  placeholder="Imperdível"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Ícone (Ionicons)</Label>
                <Input
                  value={data.icon}
                  onChange={(e) => set("icon", e.target.value)}
                  placeholder="sunny"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Capa (local)</Label>
              <Select
                value={data.coverPlaceId}
                onChange={(e) => set("coverPlaceId", e.target.value)}
              >
                <option value="">— selecionar —</option>
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Cores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Cor principal</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.color}
                  onChange={(e) => set("color", e.target.value)}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-input bg-card"
                />
                <Input
                  value={data.color}
                  onChange={(e) => set("color", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Cor de fundo</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.tint}
                  onChange={(e) => set("tint", e.target.value)}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-input bg-card"
                />
                <Input
                  value={data.tint}
                  onChange={(e) => set("tint", e.target.value)}
                />
              </div>
            </div>
            <div
              className="rounded-lg px-4 py-3"
              style={{ backgroundColor: data.tint }}
            >
              <p className="text-sm font-semibold" style={{ color: data.color }}>
                {data.title || "Prévia do roteiro"}
              </p>
              <p className="text-xs" style={{ color: data.color, opacity: 0.8 }}>
                {data.subtitle || "subtítulo"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paradas */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">
            Paradas ({data.stops.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.stops.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-2 rounded-lg border border-border p-3 sm:grid-cols-12"
            >
              <div className="flex items-center sm:col-span-4">
                <GripVertical className="mr-1 h-4 w-4 shrink-0 text-muted-foreground" />
                <Select
                  value={s.placeId}
                  onChange={(e) => updateStop(i, { placeId: e.target.value })}
                >
                  <option value="">— local —</option>
                  {places.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>
              <Input
                className="sm:col-span-2"
                value={s.time}
                placeholder="09:00"
                onChange={(e) => updateStop(i, { time: e.target.value })}
              />
              <Input
                className="sm:col-span-2"
                value={s.duration}
                placeholder="2h"
                onChange={(e) => updateStop(i, { duration: e.target.value })}
              />
              <Input
                className="sm:col-span-3"
                value={s.tip}
                placeholder="Dica da parada"
                onChange={(e) => updateStop(i, { tip: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 sm:col-span-1"
                onClick={() =>
                  set(
                    "stops",
                    data.stops.filter((_, j) => j !== i)
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              set("stops", [
                ...data.stops,
                {
                  placeId: places[0]?.id ?? "",
                  time: "",
                  duration: "1h30",
                  tip: "",
                },
              ])
            }
          >
            <Plus className="h-4 w-4" /> Adicionar parada
          </Button>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-card/90 backdrop-blur md:left-[76px]">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-3">
          <Button variant="outline" onClick={() => router.push("/roteiros")}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={pending}>
            <Save className="h-4 w-4" />
            {pending ? "Salvando…" : "Salvar roteiro"}
          </Button>
        </div>
      </div>
    </div>
  );
}

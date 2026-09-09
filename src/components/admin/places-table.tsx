"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Star, Pencil, Trash2, Sparkles, ImageOff } from "lucide-react";

import type { Place, Category } from "@/data/types";
import { deletePlaceAction } from "@/lib/actions";
import { CategoryPill, buildCategoryMap } from "./category-badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRating } from "@/lib/utils";

const priceLabel = (n: number) => "$".repeat(n);

export function PlacesTable({
  places,
  categories,
}: {
  places: Place[];
  categories: Category[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const catMap = useMemo(() => buildCategoryMap(categories), [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [places, query, cat]);

  function handleDelete(p: Place) {
    if (
      !confirm(
        `Excluir "${p.name}"? Esta ação remove o local do painel e não pode ser desfeita.`
      )
    )
      return;
    setDeletingId(p.id);
    startTransition(async () => {
      await deletePlaceAction(p.id);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <Card>
      {/* Filtros */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, bairro ou tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="sm:w-56"
        >
          <option value="all">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Local</TableHead>
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead className="hidden lg:table-cell">Bairro</TableHead>
            <TableHead className="text-center">Nota</TableHead>
            <TableHead className="hidden sm:table-cell text-center">
              Preço
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {p.photos[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.photos[0]}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="grid size-full place-content-center text-muted-foreground">
                        <ImageOff className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/locais/${p.id}`}
                        className="truncate font-medium hover:text-primary hover:underline"
                      >
                        {p.name}
                      </Link>
                      {p.featured && (
                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.tagline}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <CategoryPill category={catMap[p.category]} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                {p.neighborhood}
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-3.5 w-3.5 fill-star text-star" />
                  {formatRating(p.rating)}
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-center text-sm font-medium text-success">
                {priceLabel(p.priceRange)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/locais/${p.id}`} aria-label="Editar">
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    disabled={pending && deletingId === p.id}
                    onClick={() => handleDelete(p)}
                    aria-label="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Nenhum local encontrado com esses filtros.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        {filtered.length} de {places.length} locais
      </div>
    </Card>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";

import type { UserReviewRow } from "@/lib/store";
import { deleteUserReviewAction } from "@/lib/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRating } from "@/lib/utils";

export function ReviewsModeration({
  reviews,
  placeName,
}: {
  reviews: UserReviewRow[];
  placeName: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(r: UserReviewRow) {
    if (!confirm("Excluir esta avaliação enviada pelo usuário?")) return;
    setDeletingId(r.id);
    startTransition(async () => {
      await deleteUserReviewAction(r.id);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Local</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead className="text-center">Nota</TableHead>
            <TableHead>Comentário</TableHead>
            <TableHead className="hidden sm:table-cell">Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <Link
                  href={`/locais/${r.placeId}`}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {placeName[r.placeId] ?? r.placeId}
                </Link>
              </TableCell>
              <TableCell className="text-sm">{r.author}</TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-3.5 w-3.5 fill-star text-star" />
                  {formatRating(r.rating)}
                </span>
              </TableCell>
              <TableCell className="max-w-md text-sm text-muted-foreground">
                {r.comment}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                {new Date(r.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  disabled={pending && deletingId === r.id}
                  onClick={() => handleDelete(r)}
                  aria-label="Excluir avaliação"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {reviews.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Nenhuma avaliação enviada pelos usuários ainda.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

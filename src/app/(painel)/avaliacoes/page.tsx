export const dynamic = "force-dynamic";

import Link from "next/link";
import { Star, MessageSquareText } from "lucide-react";

import { getPlaces, getUserReviews } from "@/lib/store";
import { PageHeader } from "@/components/admin/page-header";
import { ReviewsModeration } from "@/components/admin/reviews-moderation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRating } from "@/lib/utils";

export default async function AvaliacoesPage() {
  const [places, userReviews] = await Promise.all([
    getPlaces(),
    getUserReviews(),
  ]);

  const placeName = places.reduce(
    (acc, p) => {
      acc[p.id] = p.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const editorial = places
    .flatMap((p) =>
      (p.reviews ?? []).map((r) => ({ ...r, placeId: p.id, placeName: p.name }))
    )
    .sort((a, b) => b.rating - a.rating);

  return (
    <>
      <PageHeader
        title="Avaliações"
        description="Modere as avaliações dos usuários e edite as avaliações em destaque."
      />

      {/* Avaliações dos usuários (Supabase: tabela reviews) */}
      <div className="mb-2 flex items-center gap-2">
        <MessageSquareText className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-semibold">
          Enviadas pelos usuários ({userReviews.length})
        </h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Avaliações reais feitas no app (tabela <code>reviews</code>). Excluir
        aqui remove definitivamente do banco.
      </p>
      <ReviewsModeration reviews={userReviews} placeName={placeName} />

      {/* Avaliações editoriais (places.sample_reviews) */}
      <div className="mb-2 mt-8 flex items-center gap-2">
        <Star className="h-4 w-4 text-star" />
        <h2 className="text-lg font-semibold">
          Em destaque / editoriais ({editorial.length})
        </h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Comentários curados exibidos em cada local (campo{" "}
        <code>sample_reviews</code>). Edite-os na aba “Avaliações” de cada local.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Por local</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editorial.map((r, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/locais/${r.placeId}`}
                    className="text-sm font-medium hover:text-primary hover:underline"
                  >
                    {r.placeName}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    · {r.author} · {r.date}
                  </span>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {r.comment}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-star">
                <Star className="h-3.5 w-3.5 fill-current" />
                {formatRating(r.rating)}
              </span>
            </div>
          ))}
          {editorial.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma avaliação editorial cadastrada.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

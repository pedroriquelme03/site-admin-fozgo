export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  MapPin,
  Star,
  Sparkles,
  Route,
  MessageSquare,
  Tags,
  Plus,
  ArrowRight,
} from "lucide-react";

import { getPlaces, getCategories, getItineraries } from "@/lib/store";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { CategoryPill, buildCategoryMap } from "@/components/admin/category-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCount, formatRating } from "@/lib/utils";

export default async function DashboardPage() {
  const [places, categories, itineraries] = await Promise.all([
    getPlaces(),
    getCategories(),
    getItineraries(),
  ]);
  const catMap = buildCategoryMap(categories);

  const featured = places.filter((p) => p.featured);
  const embeddedReviews = places.reduce(
    (n, p) => n + (p.reviews?.length ?? 0),
    0
  );
  const avgRating =
    places.length > 0
      ? places.reduce((s, p) => s + p.rating, 0) / places.length
      : 0;

  const byCategory = categories
    .map((c) => ({
      cat: c,
      count: places.filter((p) => p.category === c.id).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...byCategory.map((b) => b.count));

  const topRated = [...places]
    .sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral do conteúdo do app FozGo."
        actions={
          <Button asChild>
            <Link href="/locais/novo">
              <Plus className="h-4 w-4" />
              Novo local
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Locais cadastrados"
          value={places.length}
          hint={`${categories.length} categorias`}
          icon={MapPin}
          accent="#0EA5B7"
        />
        <StatCard
          label="Em destaque"
          value={featured.length}
          hint="aparecem na Home"
          icon={Sparkles}
          accent="#F97316"
        />
        <StatCard
          label="Nota média"
          value={formatRating(avgRating)}
          hint={`${formatCount(
            places.reduce((s, p) => s + p.reviewsCount, 0)
          )} avaliações no total`}
          icon={Star}
          accent="#FFB020"
        />
        <StatCard
          label="Roteiros"
          value={itineraries.length}
          hint={`${embeddedReviews} comentários destacados`}
          icon={Route}
          accent="#7C3AED"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Distribuição por categoria */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Tags className="h-4 w-4 text-primary" />
              Locais por categoria
            </CardTitle>
            <Link
              href="/categorias"
              className="text-sm font-medium text-primary hover:underline"
            >
              Gerenciar
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {byCategory.map(({ cat, count }) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="w-32 shrink-0">
                  <CategoryPill category={cat} />
                </div>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(count / maxCount) * 100}%`,
                      backgroundColor: cat.base,
                    }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-sm font-semibold tabular-nums">
                  {count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top avaliados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4 text-star" />
              Melhor avaliados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {topRated.map((p) => (
              <Link
                key={p.id}
                href={`/locais/${p.id}`}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
              >
                <span className="min-w-0 truncate text-sm font-medium">
                  {p.name}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-star">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {formatRating(p.rating)}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Destaques */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Em destaque na Home ({featured.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/locais/${p.id}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <div className="mt-1">
                    <CategoryPill category={catMap[p.category]} />
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <MessageSquare className="h-3.5 w-3.5" />
        Conectado ao Supabase (projeto System-FozGo). Locais, categorias e
        roteiros são gravados no banco; avaliações e usuários vêm das tabelas{" "}
        <code>reviews</code> e <code>profiles</code>.
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";

import { Palette, Database, Smartphone } from "lucide-react";

import { getPlaces, getCategories, getItineraries } from "@/lib/store";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const brandColors = [
  { name: "Navy (FOZ)", value: "#123A5B" },
  { name: "Teal (GO)", value: "#0EA5B7" },
  { name: "Teal Deep", value: "#0E7C8B" },
  { name: "Pin verde", value: "#34C759" },
  { name: "Estrela", value: "#FFB020" },
];

export default async function ConfiguracoesPage() {
  const [places, categories, itineraries] = await Promise.all([
    getPlaces(),
    getCategories(),
    getItineraries(),
  ]);

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Marca, dados e integração do painel FozGo."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4 text-primary" />
              Cores da marca
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {brandColors.map((c) => (
              <div
                key={c.value}
                className="flex items-center gap-3 rounded-lg border border-border p-2"
              >
                <span
                  className="size-9 shrink-0 rounded-lg"
                  style={{ backgroundColor: c.value }}
                />
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <code className="text-xs text-muted-foreground">
                    {c.value}
                  </code>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4 text-primary" />
              Banco de dados (Supabase)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Locais</span>
              <span className="font-semibold">{places.length}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Categorias</span>
              <span className="font-semibold">{categories.length}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Roteiros</span>
              <span className="font-semibold">{itineraries.length}</span>
            </div>
            <p className="pt-2 text-xs text-muted-foreground">
              Projeto <code>System-FozGo</code> (sa-east-1). O painel grava via{" "}
              <code>service_role</code> no servidor; o app lê pelas policies de
              RLS (leitura pública dos locais publicados).
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="h-4 w-4 text-primary" />
              Como conectar ao app
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              O painel já grava tudo no Supabase. Falta o app{" "}
              <strong>ler</strong> desse mesmo banco (hoje ele usa{" "}
              <code>app/src/data/*.ts</code> estático):
            </p>
            <ol className="ml-4 list-decimal space-y-1.5">
              <li>
                Instalar <code>@supabase/supabase-js</code> no app e criar um
                client com a URL + chave publicável.
              </li>
              <li>
                Trocar as leituras de <code>places</code>/<code>categories</code>
                /<code>itineraries</code> por consultas ao Supabase (a leitura
                pública já está liberada por RLS).
              </li>
              <li>
                Implementar os stubs <code>favorites/remote.ts</code> e{" "}
                <code>reviews/remote.ts</code> usando as tabelas{" "}
                <code>favorites</code> e <code>reviews</code> (RLS por usuário já
                configurado).
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

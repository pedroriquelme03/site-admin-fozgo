"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  ArrowLeft,
  ImagePlus,
  Star,
  Utensils,
  Ticket,
  MessageSquare,
  Info,
} from "lucide-react";

import type {
  Place,
  Category,
  CategoryId,
  MenuSection,
  Review,
  PriceRange,
} from "@/data/types";
import { upsertPlaceAction } from "@/lib/actions";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const GASTRO: CategoryId[] = ["restaurantes", "cafes", "bares"];

function emptyPlace(): Place {
  return {
    id: "",
    name: "",
    category: "restaurantes",
    tagline: "",
    description: "",
    photos: [],
    neighborhood: "",
    address: "",
    coords: { lat: -25.5478, lng: -54.5839 },
    hours: [],
    phone: "",
    whatsapp: "",
    socials: {},
    rating: 4.5,
    reviewsCount: 0,
    priceRange: 2,
    paymentMethods: [],
    tags: [],
    featured: false,
    published: true,
    distanceKm: 0,
    reviews: [],
    menu: [],
    ticket: "",
    importantInfo: [],
    howToArrive: "",
  };
}

/* ── pequenos blocos reutilizáveis ── */

function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function StringList({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={v}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive hover:bg-destructive/10"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...values, ""])}
        >
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>
    </Field>
  );
}

/* ── formulário principal ── */

export function PlaceForm({
  place,
  categories,
  isNew,
}: {
  place?: Place;
  categories: Category[];
  isNew: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState<Place>(place ?? emptyPlace());
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState("geral");
  const [error, setError] = useState<string | null>(null);

  const isGastro = GASTRO.includes(data.category);

  function set<K extends keyof Place>(key: K, value: Place[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function submit() {
    setError(null);
    if (!data.name.trim()) {
      setTab("geral");
      setError("O nome do local é obrigatório.");
      return;
    }
    const id = data.id || slugify(data.name);
    if (!id) {
      setError("Não foi possível gerar um identificador a partir do nome.");
      return;
    }
    const clean: Place = {
      ...data,
      id,
      photos: data.photos.filter(Boolean),
      tags: data.tags.filter(Boolean),
      paymentMethods: (data.paymentMethods ?? []).filter(Boolean),
      hours: data.hours.filter((h) => h.label || h.value),
      importantInfo: (data.importantInfo ?? []).filter(Boolean),
      menu: isGastro ? data.menu : undefined,
      reviews: data.reviews ?? [],
    };
    startTransition(async () => {
      await upsertPlaceAction(clean);
      router.push("/locais");
      router.refresh();
    });
  }

  const tabs = [
    { id: "geral", label: "Geral", icon: Info },
    { id: "midia", label: "Mídia & contato", icon: ImagePlus },
    ...(isGastro
      ? [{ id: "cardapio", label: "Cardápio", icon: Utensils }]
      : [{ id: "atracao", label: "Atração", icon: Ticket }]),
    { id: "avaliacoes", label: "Avaliações", icon: MessageSquare },
  ];

  return (
    <div className="pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.push("/locais")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">
            {isNew ? "Novo local" : data.name || "Editar local"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isNew
              ? "Cadastre um novo local no app FozGo."
              : `ID: ${data.id}`}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              <t.icon className="h-4 w-4" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── GERAL ── */}
        <TabsContent value="geral">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Informações básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Nome">
                  <Input
                    value={data.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Cataratas do Iguaçu"
                  />
                </Field>
                <Field
                  label="Frase de destaque (tagline)"
                  hint="Aparece abaixo do nome nos cards e no topo da página."
                >
                  <Input
                    value={data.tagline}
                    onChange={(e) => set("tagline", e.target.value)}
                    placeholder="Uma das 7 Maravilhas da Natureza"
                  />
                </Field>
                <Field label="Descrição">
                  <Textarea
                    rows={5}
                    value={data.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Descrição completa do local…"
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Bairro">
                    <Input
                      value={data.neighborhood}
                      onChange={(e) => set("neighborhood", e.target.value)}
                    />
                  </Field>
                  <Field label="Endereço">
                    <Input
                      value={data.address}
                      onChange={(e) => set("address", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Latitude">
                    <Input
                      type="number"
                      step="any"
                      value={data.coords.lat}
                      onChange={(e) =>
                        set("coords", {
                          ...data.coords,
                          lat: Number(e.target.value),
                        })
                      }
                    />
                  </Field>
                  <Field label="Longitude">
                    <Input
                      type="number"
                      step="any"
                      value={data.coords.lng}
                      onChange={(e) =>
                        set("coords", {
                          ...data.coords,
                          lng: Number(e.target.value),
                        })
                      }
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">Classificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Categoria">
                  <Select
                    value={data.category}
                    onChange={(e) =>
                      set("category", e.target.value as CategoryId)
                    }
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Faixa de preço">
                  <Select
                    value={String(data.priceRange)}
                    onChange={(e) =>
                      set("priceRange", Number(e.target.value) as PriceRange)
                    }
                  >
                    <option value="1">$ — Econômico</option>
                    <option value="2">$$ — Moderado</option>
                    <option value="3">$$$ — Caro</option>
                    <option value="4">$$$$ — Luxo</option>
                  </Select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nota (0–5)">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={data.rating}
                      onChange={(e) => set("rating", Number(e.target.value))}
                    />
                  </Field>
                  <Field label="Nº avaliações">
                    <Input
                      type="number"
                      min="0"
                      value={data.reviewsCount}
                      onChange={(e) =>
                        set("reviewsCount", Number(e.target.value))
                      }
                    />
                  </Field>
                </div>
                <Field label="Distância (km)">
                  <Input
                    type="number"
                    step="0.1"
                    value={data.distanceKm ?? 0}
                    onChange={(e) => set("distanceKm", Number(e.target.value))}
                  />
                </Field>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">Em destaque</p>
                    <p className="text-xs text-muted-foreground">
                      Aparece nos destaques da Home
                    </p>
                  </div>
                  <Switch
                    checked={!!data.featured}
                    onCheckedChange={(v) => set("featured", v)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">Publicado</p>
                    <p className="text-xs text-muted-foreground">
                      Visível no app (desligado = rascunho)
                    </p>
                  </div>
                  <Switch
                    checked={data.published !== false}
                    onCheckedChange={(v) => set("published", v)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── MÍDIA & CONTATO ── */}
        <TabsContent value="midia">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fotos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.photos.map((url, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      {url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={url}
                          alt=""
                          className="size-full object-cover"
                        />
                      )}
                    </div>
                    <Input
                      value={url}
                      placeholder="https://…"
                      onChange={(e) => {
                        const next = [...data.photos];
                        next[i] = e.target.value;
                        set("photos", next);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        set(
                          "photos",
                          data.photos.filter((_, j) => j !== i)
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
                  onClick={() => set("photos", [...data.photos, ""])}
                >
                  <ImagePlus className="h-4 w-4" /> Adicionar foto (URL)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contato & redes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Telefone">
                    <Input
                      value={data.phone ?? ""}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+55 45 3521-4400"
                    />
                  </Field>
                  <Field label="WhatsApp" hint="Somente números com DDI/DDD">
                    <Input
                      value={data.whatsapp ?? ""}
                      onChange={(e) => set("whatsapp", e.target.value)}
                      placeholder="5545999990001"
                    />
                  </Field>
                </div>
                <Field label="Instagram">
                  <Input
                    value={data.socials?.instagram ?? ""}
                    onChange={(e) =>
                      set("socials", {
                        ...data.socials,
                        instagram: e.target.value,
                      })
                    }
                    placeholder="@perfil"
                  />
                </Field>
                <Field label="Facebook">
                  <Input
                    value={data.socials?.facebook ?? ""}
                    onChange={(e) =>
                      set("socials", {
                        ...data.socials,
                        facebook: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="Website">
                  <Input
                    value={data.socials?.website ?? ""}
                    onChange={(e) =>
                      set("socials", {
                        ...data.socials,
                        website: e.target.value,
                      })
                    }
                    placeholder="site.com.br"
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Horários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.hours.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={h.label}
                      placeholder="Seg – Sáb"
                      className="w-2/5"
                      onChange={(e) => {
                        const next = [...data.hours];
                        next[i] = { ...next[i], label: e.target.value };
                        set("hours", next);
                      }}
                    />
                    <Input
                      value={h.value}
                      placeholder="09:00 – 18:00"
                      onChange={(e) => {
                        const next = [...data.hours];
                        next[i] = { ...next[i], value: e.target.value };
                        set("hours", next);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        set(
                          "hours",
                          data.hours.filter((_, j) => j !== i)
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
                    set("hours", [...data.hours, { label: "", value: "" }])
                  }
                >
                  <Plus className="h-4 w-4" /> Adicionar horário
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tags & pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StringList
                  label="Tags"
                  values={data.tags}
                  onChange={(v) => set("tags", v)}
                  placeholder="Família, Natureza…"
                />
                <StringList
                  label="Formas de pagamento"
                  values={data.paymentMethods ?? []}
                  onChange={(v) => set("paymentMethods", v)}
                  placeholder="Pix, Visa, Dinheiro…"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── CARDÁPIO ── */}
        {isGastro && (
          <TabsContent value="cardapio">
            <MenuEditor
              menu={data.menu ?? []}
              onChange={(m) => set("menu", m)}
            />
          </TabsContent>
        )}

        {/* ── ATRAÇÃO ── */}
        {!isGastro && (
          <TabsContent value="atracao">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ingresso & acesso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field
                    label="Valor da entrada / ingresso"
                    hint="Texto livre — ex.: “A partir de R$ 100 (inteira)”"
                  >
                    <Input
                      value={data.ticket ?? ""}
                      onChange={(e) => set("ticket", e.target.value)}
                    />
                  </Field>
                  <Field label="Como chegar">
                    <Textarea
                      rows={4}
                      value={data.howToArrive ?? ""}
                      onChange={(e) => set("howToArrive", e.target.value)}
                    />
                  </Field>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Informações importantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StringList
                    label="Itens (aparecem em lista com marcadores)"
                    values={data.importantInfo ?? []}
                    onChange={(v) => set("importantInfo", v)}
                    placeholder="Leve documento com foto."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* ── AVALIAÇÕES ── */}
        <TabsContent value="avaliacoes">
          <ReviewsEditor
            reviews={data.reviews ?? []}
            onChange={(r) => set("reviews", r)}
          />
        </TabsContent>
      </Tabs>

      {/* Barra fixa de ação */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-card/90 backdrop-blur md:left-[76px]">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-3">
          <Button variant="outline" onClick={() => router.push("/locais")}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={pending}>
            <Save className="h-4 w-4" />
            {pending ? "Salvando…" : "Salvar local"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Editor de cardápio ── */

function MenuEditor({
  menu,
  onChange,
}: {
  menu: MenuSection[];
  onChange: (m: MenuSection[]) => void;
}) {
  function updateSection(i: number, patch: Partial<MenuSection>) {
    const next = [...menu];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {menu.map((section, si) => (
        <Card key={si}>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <div className="flex flex-1 items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Input
                value={section.title}
                placeholder="Nome da seção (Entradas, Bebidas…)"
                onChange={(e) => updateSection(si, { title: e.target.value })}
                className="max-w-xs font-semibold"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => onChange(menu.filter((_, j) => j !== si))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.items.map((item, ii) => (
              <div
                key={ii}
                className="grid grid-cols-1 gap-2 rounded-lg border border-border p-3 sm:grid-cols-12"
              >
                <Input
                  className="sm:col-span-4"
                  value={item.name}
                  placeholder="Nome do item"
                  onChange={(e) => {
                    const items = [...section.items];
                    items[ii] = { ...items[ii], name: e.target.value };
                    updateSection(si, { items });
                  }}
                />
                <Input
                  className="sm:col-span-5"
                  value={item.description ?? ""}
                  placeholder="Descrição"
                  onChange={(e) => {
                    const items = [...section.items];
                    items[ii] = { ...items[ii], description: e.target.value };
                    updateSection(si, { items });
                  }}
                />
                <Input
                  className="sm:col-span-2"
                  type="number"
                  value={item.price}
                  placeholder="Preço"
                  onChange={(e) => {
                    const items = [...section.items];
                    items[ii] = { ...items[ii], price: Number(e.target.value) };
                    updateSection(si, { items });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 sm:col-span-1"
                  onClick={() =>
                    updateSection(si, {
                      items: section.items.filter((_, j) => j !== ii),
                    })
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
                updateSection(si, {
                  items: [...section.items, { name: "", price: 0 }],
                })
              }
            >
              <Plus className="h-4 w-4" /> Adicionar item
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...menu, { title: "", items: [] }])}
      >
        <Plus className="h-4 w-4" /> Adicionar seção do cardápio
      </Button>
    </div>
  );
}

/* ── Editor de avaliações ── */

function ReviewsEditor({
  reviews,
  onChange,
}: {
  reviews: Review[];
  onChange: (r: Review[]) => void;
}) {
  function update(i: number, patch: Partial<Review>) {
    const next = [...reviews];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Avaliações em destaque ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-1 gap-2 rounded-lg border border-border p-3 sm:grid-cols-12"
          >
            <Input
              className="sm:col-span-3"
              value={r.author}
              placeholder="Autor"
              onChange={(e) => update(i, { author: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Select
                value={String(r.rating)}
                onChange={(e) => update(i, { rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} ★
                  </option>
                ))}
              </Select>
            </div>
            <Input
              className="sm:col-span-4"
              value={r.comment}
              placeholder="Comentário"
              onChange={(e) => update(i, { comment: e.target.value })}
            />
            <Input
              className="sm:col-span-2"
              value={r.date}
              placeholder="jul 2026"
              onChange={(e) => update(i, { date: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10 sm:col-span-1"
              onClick={() => onChange(reviews.filter((_, j) => j !== i))}
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
            onChange([
              ...reviews,
              { author: "", rating: 5, comment: "", date: "" },
            ])
          }
        >
          <Star className="h-4 w-4" /> Adicionar avaliação
        </Button>
      </CardContent>
    </Card>
  );
}

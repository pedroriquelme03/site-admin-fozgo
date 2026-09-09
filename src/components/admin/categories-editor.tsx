"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Check } from "lucide-react";

import type { Category } from "@/data/types";
import { saveCategoriesAction } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CategoriesEditor({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const [list, setList] = useState<Category[]>(categories);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function update(i: number, patch: Partial<Category>) {
    setSaved(false);
    setList((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  function save() {
    startTransition(async () => {
      await saveCategoriesAction(list);
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {list.map((c, i) => (
          <Card key={c.id}>
            <CardContent className="flex gap-4 p-4">
              <div
                className="grid size-14 shrink-0 place-content-center rounded-xl text-lg font-bold"
                style={{ backgroundColor: c.tint, color: c.base }}
              >
                {c.label.charAt(0)}
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-muted-foreground">{c.id}</code>
                  <Badge variant="muted">{counts[c.id] ?? 0} locais</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1 block text-xs">Rótulo</Label>
                    <Input
                      value={c.label}
                      onChange={(e) => update(i, { label: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs">
                      Ícone (Ionicons)
                    </Label>
                    <Input
                      value={c.icon}
                      onChange={(e) => update(i, { icon: e.target.value })}
                      placeholder="restaurant"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs">Cor base</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={c.base}
                        onChange={(e) => update(i, { base: e.target.value })}
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-input bg-card"
                      />
                      <Input
                        value={c.base}
                        onChange={(e) => update(i, { base: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs">Cor de fundo</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={c.tint}
                        onChange={(e) => update(i, { tint: e.target.value })}
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-input bg-card"
                      />
                      <Input
                        value={c.tint}
                        onChange={(e) => update(i, { tint: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1 text-sm text-success">
            <Check className="h-4 w-4" /> Alterações salvas
          </span>
        )}
        <Button onClick={save} disabled={pending}>
          <Save className="h-4 w-4" />
          {pending ? "Salvando…" : "Salvar categorias"}
        </Button>
      </div>
    </>
  );
}

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LogIn, Loader2 } from "lucide-react";

import { loginAction, type LoginState } from "@/lib/auth-actions";
import { FozGoMark } from "@/components/admin/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogIn className="h-4 w-4" />
      )}
      {pending ? "Entrando…" : "Entrar"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <FozGoMark className="size-14" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight">FozGo Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre para gerenciar o conteúdo do app.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1.5 block">
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1.5 block">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            {state?.error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <SubmitButton />
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Acesso restrito. Apenas contas autorizadas conseguem entrar.
        </p>
      </div>
    </div>
  );
}

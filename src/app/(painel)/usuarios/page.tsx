export const dynamic = "force-dynamic";

import { Users, ShieldCheck } from "lucide-react";

import { getProfiles } from "@/lib/store";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function UsuariosPage() {
  const profiles = await getProfiles();

  return (
    <>
      <PageHeader
        title="Usuários"
        description={`${profiles.length} contas cadastradas no app FozGo.`}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" />
            Perfis (tabela profiles)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                <TableHead className="hidden md:table-cell">Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.name || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {u.email ?? "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {u.phone || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
              {profiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex flex-col items-center gap-2 py-12 text-center">
                      <span className="grid size-12 place-content-center rounded-2xl bg-primary/10 text-primary">
                        <Users className="h-6 w-6" />
                      </span>
                      <p className="text-sm font-medium">
                        Nenhum usuário cadastrado ainda
                      </p>
                      <p className="max-w-md text-sm text-muted-foreground">
                        Assim que alguém criar conta no app (Supabase Auth), o
                        perfil aparecerá aqui automaticamente.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-success" />
            Segurança & privacidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            A autenticação e as senhas são gerenciadas pelo{" "}
            <strong>Supabase Auth</strong> (esquema <code>auth</code>) — o painel
            lê apenas a tabela pública <code>profiles</code> (nome, e-mail,
            telefone), nunca a senha.
          </p>
          <p>
            O RLS garante que cada usuário acessa apenas os próprios favoritos e
            avaliações no app; o painel usa a <code>service_role</code> no
            servidor para uma visão administrativa completa.
          </p>
        </CardContent>
      </Card>
    </>
  );
}

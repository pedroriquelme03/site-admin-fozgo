import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/auth";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Defesa em profundidade — o middleware já bloqueia, mas garantimos aqui também.
  if (!isAdminEmail(user?.email)) {
    redirect("/login");
  }

  return <AdminShell userEmail={user?.email ?? ""}>{children}</AdminShell>;
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase de administração — usado APENAS no servidor
 * (Server Components e Server Actions). Usa a service_role key, que
 * ignora o RLS: o painel enxerga locais não publicados e pode gravar.
 * A chave nunca é enviada ao navegador.
 */

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em web/.env.local (veja .env.local.example)."
    );
  }
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

export function isSupabaseConfigured() {
  return Boolean(url && serviceKey);
}

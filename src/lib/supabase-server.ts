import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonEnv } from "./auth";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Cliente Supabase ligado aos cookies da requisição (Auth).
 * Usado em Server Components e Server Actions para ler a sessão do admin
 * e fazer login/logout. Usa a chave anon — NÃO a service_role.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  const { url, anonKey } = supabaseAnonEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Chamado a partir de um Server Component (não pode setar cookies).
          // O middleware cuida da renovação da sessão.
        }
      },
    },
  });
}

export async function getCurrentUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

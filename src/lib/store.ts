import { getAdminClient } from "./supabase";
import {
  rowToPlace,
  placeToRow,
  rowToCategory,
  categoryToRow,
  rowToItinerary,
  itineraryToRow,
} from "./mappers";
import type { Place, Category, Itinerary } from "@/data/types";

/**
 * Camada de dados do painel — Supabase (projeto System-FozGo).
 * Roda apenas no servidor (service_role). Mantém as mesmas assinaturas
 * usadas pelas páginas e Server Actions.
 */

/* ───────────────────────── Places ───────────────────────── */

export async function getPlaces(): Promise<Place[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .order("featured", { ascending: false })
    .order("rating", { ascending: false });
  if (error) throw new Error(`Erro ao carregar locais: ${error.message}`);
  return (data ?? []).map(rowToPlace);
}

export async function getPlace(id: string): Promise<Place | undefined> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Erro ao carregar local: ${error.message}`);
  return data ? rowToPlace(data) : undefined;
}

export async function savePlace(place: Place): Promise<Place> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("places")
    .upsert(placeToRow(place), { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw new Error(`Erro ao salvar local: ${error.message}`);
  return rowToPlace(data);
}

export async function deletePlace(id: string): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase.from("places").delete().eq("id", id);
  if (error) throw new Error(`Erro ao excluir local: ${error.message}`);
}

/* ───────────────────────── Categories ───────────────────────── */

export async function getCategories(): Promise<Category[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Erro ao carregar categorias: ${error.message}`);
  return (data ?? []).map(rowToCategory);
}

export async function saveCategories(list: Category[]): Promise<Category[]> {
  const supabase = getAdminClient();
  const rows = list.map((c, i) => categoryToRow(c, i + 1));
  const { error } = await supabase
    .from("categories")
    .upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`Erro ao salvar categorias: ${error.message}`);
  return list;
}

/* ───────────────────────── Itineraries ───────────────────────── */

export async function getItineraries(): Promise<Itinerary[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("itineraries")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Erro ao carregar roteiros: ${error.message}`);
  return (data ?? []).map(rowToItinerary);
}

export async function getItinerary(id: string): Promise<Itinerary | undefined> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("itineraries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Erro ao carregar roteiro: ${error.message}`);
  return data ? rowToItinerary(data) : undefined;
}

export async function saveItinerary(it: Itinerary): Promise<Itinerary> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("itineraries")
    .upsert(itineraryToRow(it), { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw new Error(`Erro ao salvar roteiro: ${error.message}`);
  return rowToItinerary(data);
}

export async function deleteItinerary(id: string): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase.from("itineraries").delete().eq("id", id);
  if (error) throw new Error(`Erro ao excluir roteiro: ${error.message}`);
}

/* ───────────────────────── Reviews & Users (somente leitura) ───────────────────────── */

export type UserReviewRow = {
  id: string;
  placeId: string;
  userId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export async function getUserReviews(): Promise<UserReviewRow[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, place_id, user_id, author, rating, comment, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Erro ao carregar avaliações: ${error.message}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => ({
    id: r.id,
    placeId: r.place_id,
    userId: r.user_id,
    author: r.author ?? "",
    rating: r.rating,
    comment: r.comment ?? "",
    createdAt: r.created_at,
  }));
}

export async function deleteUserReview(id: string): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(`Erro ao excluir avaliação: ${error.message}`);
}

export type ProfileRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  createdAt: string;
};

export async function getProfiles(): Promise<ProfileRow[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, phone, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Erro ao carregar usuários: ${error.message}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name ?? "",
    email: r.email,
    phone: r.phone ?? "",
    createdAt: r.created_at,
  }));
}

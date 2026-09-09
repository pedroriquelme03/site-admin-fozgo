"use server";

import { revalidatePath } from "next/cache";
import {
  savePlace,
  deletePlace,
  saveCategories,
  saveItinerary,
  deleteItinerary,
  deleteUserReview,
} from "./store";
import type { Place, Category, Itinerary } from "@/data/types";

/* ───────────── Places ───────────── */

export async function upsertPlaceAction(place: Place) {
  await savePlace(place);
  revalidatePath("/locais");
  revalidatePath(`/locais/${place.id}`);
  revalidatePath("/");
  return { ok: true, id: place.id };
}

export async function deletePlaceAction(id: string) {
  await deletePlace(id);
  revalidatePath("/locais");
  revalidatePath("/");
  return { ok: true };
}

/* ───────────── Categories ───────────── */

export async function saveCategoriesAction(list: Category[]) {
  await saveCategories(list);
  revalidatePath("/categorias");
  revalidatePath("/");
  return { ok: true };
}

/* ───────────── Itineraries ───────────── */

export async function upsertItineraryAction(it: Itinerary) {
  await saveItinerary(it);
  revalidatePath("/roteiros");
  revalidatePath(`/roteiros/${it.id}`);
  return { ok: true, id: it.id };
}

export async function deleteItineraryAction(id: string) {
  await deleteItinerary(id);
  revalidatePath("/roteiros");
  return { ok: true };
}

/* ───────────── Reviews (moderação) ───────────── */

export async function deleteUserReviewAction(id: string) {
  await deleteUserReview(id);
  revalidatePath("/avaliacoes");
  return { ok: true };
}

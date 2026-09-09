import type {
  Place,
  Category,
  Itinerary,
  PriceRange,
  Review,
  MenuSection,
  ItineraryStop,
} from "@/data/types";

/* ───────────────────────── Places ───────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToPlace(r: any): Place {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    tagline: r.tagline ?? "",
    description: r.description ?? "",
    photos: r.photos ?? [],
    neighborhood: r.neighborhood ?? "",
    address: r.address ?? "",
    coords: { lat: Number(r.lat ?? 0), lng: Number(r.lng ?? 0) },
    hours: (r.hours ?? []) as { label: string; value: string }[],
    phone: r.phone ?? undefined,
    whatsapp: r.whatsapp ?? undefined,
    socials: r.socials ?? undefined,
    rating: Number(r.rating ?? 0),
    reviewsCount: Number(r.reviews_count ?? 0),
    priceRange: (Number(r.price_range ?? 2) as PriceRange),
    paymentMethods: r.payment_methods ?? undefined,
    tags: r.tags ?? [],
    featured: r.featured ?? false,
    published: r.published ?? true,
    distanceKm: r.distance_km != null ? Number(r.distance_km) : undefined,
    reviews: (r.sample_reviews ?? undefined) as Review[] | undefined,
    menu: (r.menu ?? undefined) as MenuSection[] | undefined,
    ticket: r.ticket ?? undefined,
    importantInfo: r.important_info ?? undefined,
    howToArrive: r.how_to_arrive ?? undefined,
  };
}

export function placeToRow(p: Place) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    tagline: p.tagline ?? "",
    description: p.description ?? "",
    photos: p.photos ?? [],
    neighborhood: p.neighborhood ?? "",
    address: p.address ?? "",
    lat: p.coords?.lat ?? 0,
    lng: p.coords?.lng ?? 0,
    hours: p.hours ?? [],
    phone: p.phone || null,
    whatsapp: p.whatsapp || null,
    socials: p.socials ?? {},
    rating: p.rating ?? 0,
    reviews_count: p.reviewsCount ?? 0,
    price_range: p.priceRange ?? 2,
    payment_methods: p.paymentMethods ?? [],
    tags: p.tags ?? [],
    featured: p.featured ?? false,
    published: p.published ?? true,
    distance_km: p.distanceKm ?? null,
    ticket: p.ticket || null,
    important_info: p.importantInfo ?? [],
    how_to_arrive: p.howToArrive || null,
    menu: p.menu ?? null,
    sample_reviews: p.reviews ?? [],
    updated_at: new Date().toISOString(),
  };
}

/* ───────────────────────── Categories ───────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToCategory(r: any): Category {
  return {
    id: r.id,
    label: r.label ?? "",
    icon: r.icon ?? "",
    base: r.base ?? "#0EA5B7",
    tint: r.tint ?? "#E1F5F7",
  };
}

export function categoryToRow(c: Category, sortOrder: number) {
  return {
    id: c.id,
    label: c.label,
    icon: c.icon,
    base: c.base,
    tint: c.tint,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

/* ───────────────────────── Itineraries ───────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToItinerary(r: any): Itinerary {
  return {
    id: r.id,
    title: r.title ?? "",
    subtitle: r.subtitle ?? "",
    description: r.description ?? "",
    duration: r.duration ?? "",
    tag: r.tag ?? "",
    icon: r.icon ?? "",
    color: r.color ?? "#0EA5B7",
    tint: r.tint ?? "#E1F5F7",
    coverPlaceId: r.cover_place_id ?? "",
    stops: (r.stops ?? []) as ItineraryStop[],
  };
}

export function itineraryToRow(it: Itinerary) {
  return {
    id: it.id,
    title: it.title,
    subtitle: it.subtitle ?? "",
    description: it.description ?? "",
    duration: it.duration ?? "",
    tag: it.tag ?? "",
    icon: it.icon ?? "",
    color: it.color ?? "#0EA5B7",
    tint: it.tint ?? "#E1F5F7",
    cover_place_id: it.coverPlaceId || null,
    stops: it.stops ?? [],
    updated_at: new Date().toISOString(),
  };
}

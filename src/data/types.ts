export type CategoryId =
  | 'restaurantes'
  | 'cafes'
  | 'bares'
  | 'pontos'
  | 'hoteis'
  | 'passeios'
  | 'clima'
  | 'transporte'
  | 'guias'
  | 'ingressos';

export type PriceRange = 1 | 2 | 3 | 4; // $ a $$$$

export interface MenuItem {
  name: string;
  description?: string;
  price: number;
  photo?: string;
}

export interface MenuSection {
  title: string; // Entradas, Pratos principais, Sobremesas...
  items: MenuItem[];
}

export interface Review {
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Place {
  id: string;
  name: string;
  category: CategoryId;
  tagline: string; // frase curta de destaque
  description: string;
  photos: string[];
  neighborhood: string;
  address: string;
  coords: { lat: number; lng: number };
  hours: { label: string; value: string }[];
  phone?: string;
  whatsapp?: string;
  socials?: { instagram?: string; facebook?: string; website?: string };
  rating: number;
  reviewsCount: number;
  priceRange: PriceRange;
  paymentMethods?: string[];
  tags: string[];
  featured?: boolean;
  published?: boolean; // controla se aparece no app (coluna places.published)
  distanceKm?: number;
  reviews?: Review[];

  // Restaurantes / cafés / bares
  menu?: MenuSection[];

  // Pontos turísticos / passeios
  ticket?: string; // valor da entrada, quando houver
  importantInfo?: string[];
  howToArrive?: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  icon: string; // Ionicons name
  base: string;
  tint: string;
}

export interface ItineraryStop {
  placeId: string;
  time: string;
  duration: string;
  tip: string;
}

export interface Itinerary {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  tag: string;
  icon: string;
  color: string;
  tint: string;
  coverPlaceId: string;
  stops: ItineraryStop[];
}

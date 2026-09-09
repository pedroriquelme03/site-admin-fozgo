import { Category } from './types';

/** Cores por categoria — cada categoria tem um tom para chip/ícone. (espelha app/src/theme/colors.ts) */
export const categoryColors = {
  restaurantes: { base: '#F97316', tint: '#FFF1E8' },
  cafes: { base: '#B4632B', tint: '#F7EDE4' },
  bares: { base: '#7C3AED', tint: '#F1EAFE' },
  pontos: { base: '#0EA5B7', tint: '#E1F5F7' },
  hoteis: { base: '#2563EB', tint: '#E7EEFE' },
  passeios: { base: '#16A34A', tint: '#E6F6EC' },
  clima: { base: '#0284C7', tint: '#E0F2FE' },
  transporte: { base: '#4F46E5', tint: '#ECEBFE' },
  guias: { base: '#0891B2', tint: '#DEF3F8' },
  ingressos: { base: '#E11D48', tint: '#FFE4EA' },
} as const;

export const categories: Category[] = [
  { id: 'restaurantes', label: 'Restaurantes', icon: 'restaurant', ...categoryColors.restaurantes },
  { id: 'cafes', label: 'Cafés', icon: 'cafe', ...categoryColors.cafes },
  { id: 'bares', label: 'Bares', icon: 'wine', ...categoryColors.bares },
  { id: 'pontos', label: 'Pontos turísticos', icon: 'camera', ...categoryColors.pontos },
  { id: 'passeios', label: 'Passeios', icon: 'boat', ...categoryColors.passeios },
  { id: 'hoteis', label: 'Hotéis', icon: 'bed', ...categoryColors.hoteis },
  { id: 'ingressos', label: 'Ingressos', icon: 'ticket', ...categoryColors.ingressos },
  { id: 'transporte', label: 'Transporte', icon: 'car-sport', ...categoryColors.transporte },
  { id: 'guias', label: 'Guias', icon: 'people', ...categoryColors.guias },
  { id: 'clima', label: 'Previsão', icon: 'partly-sunny', ...categoryColors.clima },
];

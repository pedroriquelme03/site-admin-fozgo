import {
  LayoutDashboard,
  MapPin,
  Tags,
  Route,
  Star,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Locais", href: "/locais", icon: MapPin },
  { title: "Categorias", href: "/categorias", icon: Tags },
  { title: "Roteiros", href: "/roteiros", icon: Route },
  { title: "Avaliações", href: "/avaliacoes", icon: Star },
  { title: "Usuários", href: "/usuarios", icon: Users },
];

export const accountNav: NavItem[] = [
  { title: "Configurações", href: "/configuracoes", icon: Settings },
];

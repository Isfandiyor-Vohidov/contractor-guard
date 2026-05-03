import { LayoutDashboard, Folder, CreditCard, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Обзор", icon: LayoutDashboard },
  { href: "/projects", label: "Проекты", icon: Folder },
  { href: "/billing", label: "Биллинг", icon: CreditCard },
  { href: "/profile", label: "Профиль", icon: Settings },
];
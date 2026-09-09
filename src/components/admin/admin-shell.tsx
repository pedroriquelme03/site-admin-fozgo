"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsRight, Menu, X, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/auth-actions";
import { FozGoMark } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { mainNav, accountNav, type NavItem } from "./nav";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  item,
  open,
  onNavigate,
}: {
  item: NavItem;
  open: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={!open ? item.title : undefined}
      className={cn(
        "relative flex h-11 items-center rounded-lg transition-colors",
        active
          ? "bg-sidebar-accent/15 text-white"
          : "text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-white"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
      )}
      <span className="grid h-full w-12 place-content-center">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      {open && <span className="text-sm font-medium">{item.title}</span>}
    </Link>
  );
}

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string;
}) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("fozgo-sidebar");
    if (stored) setOpen(stored === "open");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleCollapse = () => {
    setOpen((prev) => {
      const next = !prev;
      localStorage.setItem("fozgo-sidebar", next ? "open" : "closed");
      return next;
    });
  };

  const sidebarInner = (open: boolean, onNavigate?: () => void) => (
    <>
      {/* Marca */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-3 pb-4 pt-1">
        <FozGoMark className="size-10 shrink-0" />
        {open && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              FozGo Admin
            </p>
            <p className="truncate text-xs text-sidebar-muted">
              Painel de conteúdo
            </p>
          </div>
        )}
      </div>

      {/* Nav principal */}
      <div className="mt-4 space-y-1 px-2">
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            open={open}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* Conta */}
      <div className="mt-6 border-t border-sidebar-border px-2 pt-4">
        {open && (
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-sidebar-muted">
            Conta
          </p>
        )}
        <div className="space-y-1">
          {accountNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              open={open}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {/* Usuário + sair */}
        <div className="mt-3 border-t border-sidebar-border pt-3">
          {open && userEmail && (
            <p
              className="truncate px-3 pb-1 text-xs text-sidebar-muted"
              title={userEmail}
            >
              {userEmail}
            </p>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              title={!open ? "Sair" : undefined}
              className="flex h-11 w-full items-center rounded-lg text-sidebar-foreground/80 transition-colors hover:bg-sidebar-hover hover:text-white"
            >
              <span className="grid h-full w-12 place-content-center">
                <LogOut className="h-[18px] w-[18px]" />
              </span>
              {open && <span className="text-sm font-medium">Sair</span>}
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar desktop */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col bg-sidebar p-2 transition-[width] duration-300 ease-in-out md:flex",
          open ? "w-64" : "w-[76px]"
        )}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2">
          {sidebarInner(open)}
        </div>
        <button
          onClick={toggleCollapse}
          className="mt-2 flex items-center rounded-lg border-t border-sidebar-border pt-2 text-sidebar-muted transition-colors hover:text-white"
        >
          <span className="grid h-10 w-12 place-content-center">
            <ChevronsRight
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                open && "rotate-180"
              )}
            />
          </span>
          {open && <span className="text-sm font-medium">Recolher</span>}
        </button>
      </aside>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-sidebar p-2">
            <div className="flex justify-end">
              <button
                onClick={() => setMobileOpen(false)}
                className="grid size-9 place-content-center rounded-lg text-sidebar-muted hover:text-white"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarInner(true, () => setMobileOpen(false))}
            </div>
          </aside>
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid size-9 place-content-center rounded-lg border border-border text-muted-foreground"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <FozGoMark className="size-7" />
            <span className="text-sm font-semibold">FozGo Admin</span>
          </div>
          <ThemeToggle className="h-9 w-9" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

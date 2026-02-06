"use client";

import { Button } from "@/components/ui/button";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { logout } from "@/lib/actions/logout";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  CalendarDays,
  HelpCircle,
  PlusCircle,
  Receipt,
  Settings,
  ShieldCheck,
} from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await fetch("/api/session");
      return response.json();
    },
  });

  const handleLogout = async () => {
    await logout();
  };

  let navItems = [
    { href: "/dashboard", label: "Resumo", icon: BarChart3 },
    {
      href: "/recebimento-mensal",
      label: "Recebimento Mensal",
      icon: CalendarDays,
    },
    {
      href: "/recebimento-extra",
      label: "Recebimento Extra",
      icon: PlusCircle,
    },
    { href: "/gastos", label: "Gastos", icon: Receipt },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
  ];

  // Adicionar orientação apenas para editores
  if (session?.user?.role === "EDITOR") {
    navItems.push({ href: "/orientacao", label: "Orientação", icon: HelpCircle });
  }

  if (pathname === "/admin") {
    navItems = [
      { href: "/admin", label: "Admin", icon: ShieldCheck }
    ];
  }

  const userRole = session?.user?.role === "VIEWER" ? "" : `(${session?.user?.role})`;
  return (
    <div className="border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <Menubar className="border-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <MenubarMenu key={item.href}>
                <MenubarTrigger asChild>
                  <NextLink
                    href={item.href}
                    className={`flex items-center gap-2 ${isActive ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </NextLink>
                </MenubarTrigger>
              </MenubarMenu>
            );
          })}
        </Menubar>

        <div className="flex items-center space-x-4">
          {session?.user && (
            <span className="text-sm text-muted-foreground">
              {session.user.username} {userRole}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}

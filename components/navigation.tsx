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
import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { useEffect, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { href: "/dashboard", label: t('nav.dashboard'), icon: BarChart3 },
    {
      href: "/monthly-receipts",
      label: t('nav.monthlyReceipts'),
      icon: CalendarDays,
    },
    {
      href: "/extra-receipts",
      label: t('nav.extraReceipts'),
      icon: PlusCircle,
    },
    { href: "/expenses", label: t('nav.expenses'), icon: Receipt },
    { href: "/settings", label: t('nav.settings'), icon: Settings },
  ];

  // Add students only for editors
  if (session?.user?.role === "EDITOR") {
    navItems.push({ href: "/guide", label: t('nav.guide'), icon: HelpCircle });
  }

  // Add admin and magic links for admins
  if (session?.user?.role === "ADMIN") {
    navItems.push({ href: "/admin", label: t('nav.admin'), icon: ShieldCheck });
  }

  if (pathname === "/admin" || pathname === "/magic-links") {
    navItems = [
      { href: "/admin", label: t('nav.admin'), icon: ShieldCheck }
    ];
  }

  const userRole = session?.user?.role === "VIEWER" ? "" : `(${session?.user?.role})`;
  return (
    <div className="border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <Menubar className="border-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = mounted && pathname === item.href;

            return (
              <MenubarMenu key={item.href}>
                <MenubarTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 ${isActive ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            );
          })}
        </Menubar>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          {session?.user && (
            <span className="text-sm text-muted-foreground">
              {session.user.username} {userRole}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            {t('nav.logout')}
          </Button>
        </div>
      </div>
    </div>
  );
}

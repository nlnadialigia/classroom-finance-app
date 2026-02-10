import { Geist, Geist_Mono } from 'next/font/google';
import type React from "react";
import "./globals.css";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

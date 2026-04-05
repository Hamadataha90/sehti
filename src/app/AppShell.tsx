'use client';

import { Header } from '@/components/app/Header';
import { Footer } from '@/components/app/Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  const { currentView, navigate, goHome, searchQuery, setSearchQuery } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Active states based on actual URL + Zustand view
  const isHome = pathname === '/' && currentView === 'home';
  const isCalculators = pathname === '/' && currentView === 'calculators';
  const isAbout = pathname === '/' && currentView === 'about';
  const isArticles = pathname === '/articles';
  const isArticlePage = pathname.startsWith('/article/');

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: '🏠', href: null as string | null, active: isHome },
    { id: 'articles', label: 'المقالات', icon: '📚', href: '/articles' as string | null, active: isArticles || isArticlePage },
    { id: 'calculators', label: 'الحاسبات', icon: '🧮', href: null as string | null, active: isCalculators },
    { id: 'about', label: 'من نحن', icon: '💡', href: null as string | null, active: isAbout },
  ];

  const handleNav = (item: typeof navItems[number]) => {
    setMobileOpen(false);
    setSearchOpen(false);
    // "المقالات" uses real Link navigation - no need to handle here
    if (item.href) return;
    if (item.id === 'home') goHome();
    else navigate(item.id as 'calculators' | 'about');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('home');
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo - always use goHome for proper cross-page navigation */}
        <button onClick={goHome} className="flex items-center gap-2.5 group transition-opacity hover:opacity-80">
          <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Image src="/logo.png" alt="صِحتي" width={36} height={36} className="rounded-lg" />
          </div>
          <span className="text-xl font-bold text-foreground transition-colors duration-200 group-hover:text-emerald-600">صِحتي</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            if (item.href) {
              // Real pages (like /articles) use Next.js Link
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`btn-press inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="ml-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              );
            }
            // SPA views use button with Zustand navigation
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className={`btn-press inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span className="ml-1.5">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="hidden sm:flex items-center animate-[scaleIn_0.2s_ease-out]">
              <Input
                type="search"
                placeholder="ابحث في المقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 h-9 text-sm ring-2 ring-emerald-600/20 focus-visible:ring-emerald-600/40"
                autoFocus
              />
            </form>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-muted btn-press rounded-lg">
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-muted-foreground hover:text-foreground hover:bg-muted btn-press rounded-lg">
            {theme === 'dark' ? (
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </Button>

          <Button variant="ghost" size="icon" onClick={() => navigate('admin')} className="text-muted-foreground hover:text-foreground hover:bg-muted btn-press rounded-lg hidden lg:flex">
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="btn-press rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 pt-12">
              <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
              <form onSubmit={handleSearch} className="mb-5 px-2">
                <Input type="search" placeholder="ابحث في المقالات..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="text-sm h-11 ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-emerald-600/40" />
              </form>
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  if (item.href) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`btn-press justify-start h-11 rounded-lg transition-all duration-200 flex items-center text-sm font-medium ${
                          item.active
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <span className="ml-2.5 text-base">{item.icon}</span>
                        {item.label}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item)}
                      className={`btn-press justify-start h-11 rounded-lg transition-all duration-200 flex items-center text-sm font-medium ${
                        item.active
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="ml-2.5 text-base">{item.icon}</span>
                      {item.label}
                    </button>
                  );
                })}
                <div className="my-3 border-t border-border/50" />
                <Link
                  href="/privacy"
                  onClick={() => setMobileOpen(false)}
                  className="btn-press flex items-center justify-start h-11 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-sm font-medium w-full"
                >
                  <span className="ml-2.5 text-base">📜</span>سياسة الخصوصية
                </Link>
                <button onClick={() => { navigate('admin'); setMobileOpen(false); }} className="btn-press flex items-center justify-start h-11 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-sm font-medium w-full">
                  <span className="ml-2.5 text-base">⚙️</span>لوحة التحكم
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Link from 'next/link';
import { ArticleCard } from './ArticleComponents';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string;
  calculatorType: string | null;
  createdAt: string;
}

const categories = [
  { id: 'all', label: 'الكل', icon: '📋' },
  { id: 'nutrition', label: 'تغذية', icon: '🥗' },
  { id: 'fitness', label: 'لياقة', icon: '💪' },
  { id: 'health', label: 'صحة عامة', icon: '🏥' },
  { id: 'calculator', label: 'حاسبات', icon: '🧮' },
];

function getArticleCategory(article: Article): string {
  if (article.calculatorType) return 'calculator';
  const title = article.title;
  if (title.includes('تغذية') || title.includes('أطعمة') || title.includes('وزن') || title.includes('حمية')) return 'nutrition';
  if (title.includes('رياضة') || title.includes('عضلات') || title.includes('تمرين')) return 'fitness';
  return 'health';
}

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { openArticle, navigate, searchQuery, selectedCategory, setSelectedCategory } = useAppStore();

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/articles');
        const data = await response.json();
        setArticles(data.articles ?? []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    let filtered = articles;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((a) => getArticleCategory(a) === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((a) =>
        a.title.toLowerCase().includes(q) || (a.excerpt?.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-50 via-background to-teal-50/30 dark:from-emerald-950/30 dark:via-background dark:to-teal-950/20 py-14 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-200/25 dark:bg-teal-900/15 blur-3xl animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-100/20 dark:bg-emerald-800/10 blur-3xl animate-pulse [animation-delay:2s]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-5 py-2 text-sm text-emerald-700 dark:text-emerald-300 font-medium mb-7 shadow-sm border border-emerald-200/50 dark:border-emerald-800/30 animate-[scaleIn_0.5s_ease-out]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              صحتك هي أولويتنا
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6 animate-[slideUp_0.6s_ease-out]">
              حاسباتك الصحية
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-teal-500 block sm:inline"> الذكية</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-9 max-w-2xl mx-auto animate-[slideUp_0.6s_ease-out_0.1s]">
              أدوات مجانية لحساب السعرات ومؤشر كتلة الجسم والماء، مع مقالات عربية موثوقة في التغذية واللياقة والصحة
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-[slideUp_0.6s_ease-out_0.2s]">
              <Button onClick={() => navigate('calculators')} size="lg" className="btn-press bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-13 px-8 text-base rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-300">
                🧮 جرّب الحاسبات مجانًا
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn-press h-13 px-8 text-base rounded-xl border-border/80 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all duration-300">
                📖 تصفح المقالات
              </Button>
            </div>
          </div>
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-sm mx-auto animate-[slideUp_0.6s_ease-out_0.3s]">
            {[
              { value: '4', label: 'حاسبات صحية', delay: '0s' },
              { value: '16+', label: 'مقال متخصص', delay: '0.1s' },
              { value: '100%', label: 'مجاني', delay: '0.2s' },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-hover:scale-110">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '🔥', title: 'حاسبة السعرات', desc: 'احسب احتياجك اليومي من السعرات باستخدام معادلة Mifflin-St Jeor', cls: 'from-emerald-50 to-white dark:from-emerald-950/30 dark:to-card', border: 'hover:border-emerald-300 dark:hover:border-emerald-700', iconBg: 'bg-orange-100 dark:bg-orange-900/30' },
            { icon: '📊', title: 'حاسبة BMI', desc: 'تعرف على مؤشر كتلة جسمك وهل وزنك مناسب لطولك', cls: 'from-teal-50 to-white dark:from-teal-950/30 dark:to-card', border: 'hover:border-teal-300 dark:hover:border-teal-700', iconBg: 'bg-teal-100 dark:bg-teal-900/30' },
            { icon: '💧', title: 'حاسبة الماء', desc: 'احسب كمية الماء التي يحتاجها جسمك يوميًا', cls: 'from-cyan-50 to-white dark:from-cyan-950/30 dark:to-card', border: 'hover:border-cyan-300 dark:hover:border-cyan-700', iconBg: 'bg-cyan-100 dark:bg-cyan-900/30' },
            { icon: '⚖️', title: 'الوزن المثالي', desc: 'اكتشف الوزن المثالي لطولك وجنسك وعمرك', cls: 'from-amber-50 to-white dark:from-amber-950/30 dark:to-card', border: 'hover:border-amber-300 dark:hover:border-amber-700', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
          ].map((calc, i) => (
            <button
              key={calc.title}
              onClick={() => navigate('calculators')}
              className={`btn-press card-glow group rounded-2xl border border-border/60 bg-gradient-to-bl ${calc.cls} ${calc.border} p-5 sm:p-6 text-right overflow-hidden relative`}
              style={{ animation: `slideUp 0.5s ease-out ${i * 0.08}s both` }}
            >
              {/* Subtle background pattern on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tl from-emerald-100/20 to-transparent dark:from-emerald-900/10" />
              <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl ${calc.iconBg} text-2xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                {calc.icon}
              </div>
              <h2 className="relative text-base sm:text-lg font-bold text-foreground mb-1.5 transition-colors duration-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{calc.title}</h2>
              <p className="relative text-xs sm:text-sm text-muted-foreground leading-relaxed">{calc.desc}</p>
              <div className="relative mt-4 text-emerald-600 dark:text-emerald-400 font-medium text-xs sm:text-sm inline-flex items-center gap-1.5 transition-all duration-300 group-hover:gap-2.5">
                ابدأ الآن
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:translate-x-1 rtl:group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles-section" className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">📋 أحدث المقالات</h2>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {searchQuery ? `نتائج البحث عن "${searchQuery}"` : 'مقالات متخصصة في الصحة والتغذية واللياقة'}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-7 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn-press shrink-0 rounded-lg transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/25'
                  : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50'
              }`}
            >
              <span className="ml-1">{cat.icon}</span>
              {cat.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-border/40 overflow-hidden">
                <Skeleton className="aspect-[16/10]" />
                <div className="p-5 space-y-3"><Skeleton className="h-5 w-3/4 rounded-lg" /><Skeleton className="h-4 w-full rounded-lg" /><Skeleton className="h-4 w-1/2 rounded-lg" /></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border/60">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد مقالات في هذا التصنيف'}
            </h3>
            <p className="text-muted-foreground mb-5">جرب كلمة بحث أخرى أو تصفح التصنيفات الأخرى</p>
            {searchQuery && (
              <Button variant="outline" onClick={() => useAppStore.getState().setSearchQuery('')} className="btn-press rounded-lg border-border/60 hover:border-border">
                مسح البحث
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.slice(0, 6).map((article, i) => (
                <div key={article.id} style={{ animation: `slideUp 0.5s ease-out ${i * 0.06}s both` }}>
                  <ArticleCard article={article} onClick={() => openArticle(article)} />
                </div>
              ))}
            </div>
            {filteredArticles.length > 3 && (
              <div className="text-center mt-10">
                <Link href="/articles" className="btn-press inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 px-8 text-base shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-300">
                  📚 عرض جميع المقالات ({filteredArticles.length})
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

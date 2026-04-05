'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

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
  if (title.includes('تغذية') || title.includes('أطعمة') || title.includes('وزن') || title.includes('حمية') || title.includes('غذائي') || title.includes('بروتين') || title.includes('وجبات') || title.includes('ألياف')) return 'nutrition';
  if (title.includes('رياضة') || title.includes('عضلات') || title.includes('تمرين') || title.includes('تمارين')) return 'fitness';
  return 'health';
}

export function AllArticlesList({ articles }: { articles: Article[] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter((a) => getArticleCategory(a) === selectedCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide justify-center flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`btn-press shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                : 'border border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50'
            }`}
          >
            <span className="ml-1">{cat.icon}</span>
            {cat.label}
            <span className="mr-1.5 text-xs opacity-70">
              ({(cat.id === 'all' ? articles : articles.filter((a) => getArticleCategory(a) === cat.id)).length})
            </span>
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border/60">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد مقالات في هذا التصنيف</h3>
          <p className="text-muted-foreground">جرب تصنيفًا آخر</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, i) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:shadow-emerald-900/5 dark:hover:shadow-emerald-900/20 hover:border-emerald-200/80 dark:hover:border-emerald-800/50 hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-emerald-600/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ animation: `slideUp 0.5s ease-out ${i * 0.04}s both` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-950/20">
                {article.coverImage ? (
                  <Image src={article.coverImage} alt={article.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {article.calculatorType === 'calories' ? '🔥' : article.calculatorType === 'bmi' ? '📊' : article.calculatorType === 'water' ? '💧' : article.calculatorType === 'ideal' ? '⚖️' : '📋'}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {article.calculatorType && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-medium shadow-sm transition-transform duration-300 group-hover:scale-105">
                    {article.calculatorType === 'calories' ? '🔥 حاسبة السعرات' : article.calculatorType === 'bmi' ? '📊 حاسبة BMI' : article.calculatorType === 'water' ? '💧 حاسبة الماء' : '⚖️ الوزن المثالي'}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-foreground leading-relaxed mb-2 transition-colors duration-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 line-clamp-2">{article.title}</h2>
                {article.excerpt && <p className="text-sm text-muted-foreground leading-7 line-clamp-2 transition-colors duration-200 group-hover:text-foreground/70">{article.excerpt}</p>}
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">📅 {new Date(article.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm inline-flex items-center gap-1.5 transition-all duration-300 group-hover:gap-2.5">
                    اقرأ المقال
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

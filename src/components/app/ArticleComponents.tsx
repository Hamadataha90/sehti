'use client';

import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { toast } from 'sonner';

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

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  return (
    <article role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => e.key === 'Enter' && onClick()} className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:shadow-emerald-900/5 dark:hover:shadow-emerald-900/20 hover:border-emerald-200/80 dark:hover:border-emerald-800/50 hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-emerald-600/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-950/20">
        {article.coverImage ? (
          <Image src={article.coverImage} alt={article.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">{article.calculatorType === 'calories' ? '🔥' : article.calculatorType === 'bmi' ? '📊' : '📋'}</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {article.calculatorType && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-medium shadow-sm transition-transform duration-300 group-hover:scale-105">
            {article.calculatorType === 'calories' ? '🔥 حاسبة السعرات' : '📊 حاسبة BMI'}
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
    </article>
  );
}

export function ArticlePage({ article, allArticles, onGoHome, onGoCalculators }: {
  article: Article;
  allArticles: Article[];
  onGoHome: () => void;
  onGoCalculators: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const showCta = expanded;

  const { initialContent, remainingContent } = useMemo(() => {
    const lines = article.content.split('\n');
    const mid = Math.floor(lines.length * 0.4);
    return { initialContent: lines.slice(0, mid).join('\n'), remainingContent: lines.slice(mid).join('\n') };
  }, [article.content]);

  // Related articles (same calculator type, exclude current)
  const related = useMemo(() => {
    return allArticles.filter((a) => a.id !== article.id).slice(0, 3);
  }, [allArticles, article.id]);

  const handleReadMore = () => { setExpanded(true); triggerMonetag(); };

  // Share functions
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const articleUrl = `${siteUrl}/articles/${article.slug}`;
  const shareText = `${article.title} — صِحتي`;

  const shareWhatsApp = () => { window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + articleUrl)}`, '_blank'); };
  const shareTwitter = () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(articleUrl)}`, '_blank'); };
  const shareFacebook = () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, '_blank'); };
  const copyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    toast.success('تم نسخ الرابط ✅');
  };

  const shareButtons = [
    { fn: shareWhatsApp, label: 'واتساب', icon: (
      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    ), color: 'hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-600 dark:hover:text-green-400' },
    { fn: shareTwitter, label: 'X / تويتر', icon: (
      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    ), color: 'hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:text-sky-500 dark:hover:text-sky-400' },
    { fn: shareFacebook, label: 'فيسبوك', icon: (
      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    ), color: 'hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400' },
    { fn: copyLink, label: 'نسخ الرابط', icon: <span className="text-sm">🔗</span>, color: 'hover:bg-muted hover:text-foreground' },
  ];

  return (
    <article className="page-transition">
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-3xl px-4 pt-4 sm:px-6" aria-label="التنقل">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><button onClick={onGoHome} className="link-hover hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">الرئيسية</button></li>
          <li className="text-border/60">/</li>
          <li className="text-foreground font-medium truncate max-w-[200px]">{article.title}</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="relative aspect-[21/9] sm:aspect-[21/7] overflow-hidden bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:via-emerald-950/20 dark:to-teal-950/20">
        {article.coverImage ? (
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl sm:text-9xl opacity-20">{article.calculatorType === 'calories' ? '🔥' : article.calculatorType === 'bmi' ? '📊' : '📋'}</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight max-w-3xl">{article.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">📅 {new Date(article.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {article.calculatorType && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200/50 dark:border-emerald-800/30">
                {article.calculatorType === 'calories' ? '🔥 حاسبة السعرات' : '📊 حاسبة BMI'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm text-muted-foreground ml-1.5">شارك:</span>
          {shareButtons.map((btn) => (
            <button key={btn.label} onClick={btn.fn} className={`btn-press p-2.5 rounded-xl text-muted-foreground transition-all duration-200 ${btn.color}`} title={btn.label}>
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <div className="article-content"><ReactMarkdown>{initialContent}</ReactMarkdown></div>
        {!expanded && (
          <button onClick={handleReadMore} className="btn-press mt-8 w-full rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 px-6 py-5 text-center text-emerald-700 dark:text-emerald-300 font-semibold transition-all duration-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20">
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              اقرأ المزيد
            </span>
          </button>
        )}
        {expanded && (
          <>
            <div className="article-content mt-2"><ReactMarkdown>{remainingContent}</ReactMarkdown></div>
            {/* CTA */}
            {showCta && article.calculatorType && (
              <div className="mt-12 rounded-2xl bg-gradient-to-l from-emerald-600 to-emerald-500 dark:from-emerald-700 dark:to-emerald-600 p-8 sm:p-10 text-center shadow-xl shadow-emerald-600/15 dark:shadow-emerald-900/30 animate-[slideUp_0.5s_ease-out]">
                <div className="text-4xl mb-4">{article.calculatorType === 'calories' ? '🔥' : '📊'}</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{article.calculatorType === 'calories' ? '🔥 احسب احتياجك من السعرات الآن' : '📊 احسب مؤشر كتلة جسمك الآن'}</h2>
                <p className="text-emerald-100 mb-7 text-sm sm:text-base">اكتشف احتياجك اليومي واحصل على خطة غذائية مجانية</p>
                <button onClick={onGoCalculators} className="btn-press inline-flex items-center gap-2.5 rounded-xl bg-white dark:bg-emerald-50 px-8 py-3.5 font-bold text-emerald-700 dark:text-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                  ابدأ الحساب الآن
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
              </div>
            )}
            {showCta && !article.calculatorType && (
              <div className="mt-12 rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-500 dark:from-emerald-700 dark:to-teal-600 p-8 sm:p-10 text-center shadow-xl shadow-emerald-600/15 dark:shadow-emerald-900/30 animate-[slideUp_0.5s_ease-out]">
                <div className="text-4xl mb-4">🧮</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">🔥 جرب حاسباتنا الصحية</h2>
                <p className="text-emerald-100 mb-7 text-sm sm:text-base">حاسبات السعرات و BMI والماء والوزن المثالي — مجانًا</p>
                <button onClick={onGoCalculators} className="btn-press inline-flex items-center gap-2.5 rounded-xl bg-white dark:bg-emerald-50 px-8 py-3.5 font-bold text-emerald-700 dark:text-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                  اذهب للحاسبات
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
              </div>
            )}

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mt-14 border-t border-border/60 pt-10">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">📚 مقالات ذات صلة</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((a) => (
                    <button key={a.id} onClick={() => onGoHome()} className="group btn-press text-right rounded-2xl border border-border/50 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/5 dark:hover:shadow-emerald-900/15 hover:border-emerald-200/80 dark:hover:border-emerald-800/50 hover:-translate-y-1">
                      <div className="aspect-[16/8] rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-950/20 mb-3 relative">
                        {a.coverImage && <Image src={a.coverImage} alt={a.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="200px" />}
                      </div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">{a.title}</h3>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}

function triggerMonetag() {
  if (typeof window === 'undefined') return;
  const s = process.env.NEXT_PUBLIC_MONETAG_SRC;
  const z = process.env.NEXT_PUBLIC_MONETAG_ZONE;
  if (!s || !z) return;
  if (sessionStorage.getItem('monetag_loaded')) return;
  sessionStorage.setItem('monetag_loaded', 'true');
  try { const script = document.createElement('script'); script.src = s; script.async = true; script.setAttribute('data-zone', z); document.body.appendChild(script); } catch (err) { console.warn('Monetag failed:', err); }
}

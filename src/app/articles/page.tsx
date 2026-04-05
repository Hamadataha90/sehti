import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { AllArticlesList } from './AllArticlesList';

export const metadata: Metadata = {
  title: 'جميع المقالات الصحية | صِحتي',
  description: 'مقالات عربية متخصصة في التغذية واللياقة البدنية والصحة العامة. نصائح غذائية، تمارين رياضية، وأدوات صحية مجانية.',
  openGraph: {
    title: 'جميع المقالات الصحية | صِحتي',
    description: 'مقالات عربية متخصصة في التغذية واللياقة البدنية والصحة العامة.',
    type: 'website',
    locale: 'ar_SA',
  },
};

export default async function ArticlesPage() {
  const articles = await db.article.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="page-transition mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="التنقل">
        <a href="/" className="link-hover hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">الرئيسية</a>
        <span className="text-border/60">/</span>
        <span className="text-foreground font-medium">المقالات</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">📚 جميع المقالات الصحية</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          مقالات عربية متخصصة في التغذية واللياقة والصحة العامة لمساعدتك في تحسين نمط حياتك
        </p>
      </div>

      <AllArticlesList articles={articles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        content: a.content,
        excerpt: a.excerpt,
        coverImage: a.coverImage,
        calculatorType: a.calculatorType,
        createdAt: a.createdAt.toISOString(),
      }))} />
    </div>
  );
}

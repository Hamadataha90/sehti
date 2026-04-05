import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ArticleDetailView } from './ArticleDetailView';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  let { slug: rawSlug } = await params;
  rawSlug = decodeURIComponent(rawSlug);
  const article = await db.article.findFirst({ where: { slug: rawSlug } });

  if (!article) {
    return { title: 'مقال غير موجود | صِحتي' };
  }

  return {
    title: `${article.title} | صِحتي`,
    description: article.excerpt || 'مقال صحي متخصص على منصة صِحتي',
    alternates: {
      canonical: `/article/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt || 'مقال صحي متخصص على منصة صِحتي',
      type: 'article',
      locale: 'ar_SA',
      siteName: 'صِحتي',
      publishedTime: article.createdAt.toISOString(),
      images: article.coverImage ? [{ url: article.coverImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || 'مقال صحي متخصص على منصة صِحتي',
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  let { slug: rawSlug } = await params;
  rawSlug = decodeURIComponent(rawSlug);
  const article = await db.article.findFirst({ where: { slug: rawSlug } });

  if (!article) {
    notFound();
  }

  const relatedArticles = await db.article.findMany({
    where: { id: { not: article.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  return (
    <ArticleDetailView
      article={{
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        coverImage: article.coverImage,
        calculatorType: article.calculatorType,
        createdAt: article.createdAt.toISOString(),
      }}
      relatedArticles={relatedArticles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        coverImage: a.coverImage,
        calculatorType: a.calculatorType,
        createdAt: a.createdAt.toISOString(),
      }))}
    />
  );
}

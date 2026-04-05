import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await db.article.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Get related articles (up to 3, excluding current)
    const relatedArticles = await db.article.findMany({
      where: { id: { not: article.id } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    return NextResponse.json({
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        coverImage: article.coverImage,
        calculatorType: article.calculatorType,
        createdAt: article.createdAt.toISOString(),
      },
      relatedArticles: relatedArticles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        coverImage: a.coverImage,
        calculatorType: a.calculatorType,
        createdAt: a.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

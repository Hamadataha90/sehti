import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://calc-hub.site';

  try {
    const articles = await db.article.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        slug: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${siteUrl}/article/${article.slug}`,
      lastModified: article.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          'ar-SA': `${siteUrl}/article/${article.slug}`,
        },
      },
    }));

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
        alternates: {
          languages: {
            'ar-SA': siteUrl,
          },
        },
      },
      {
        url: `${siteUrl}/articles`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
        alternates: {
          languages: {
            'ar-SA': `${siteUrl}/articles`,
          },
        },
      },
      {
        url: `${siteUrl}/calculators`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      },
      {
        url: `${siteUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
    ];

    return [...staticPages, ...articleUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Fallback sitemap if database is unavailable
    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${siteUrl}/articles`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ];
  }
}

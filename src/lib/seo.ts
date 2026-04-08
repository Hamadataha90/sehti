import type { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  author?: string;
  publishedDate?: Date;
  modifiedDate?: Date;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calc-hub.site';
const SITE_NAME = 'صِحتي';

export function generateMetadata(seo: SEOConfig): Metadata {
  const fullUrl = seo.canonicalUrl ? `${SITE_URL}${seo.canonicalUrl}` : SITE_URL;
  const ogImage = seo.ogImage || '/og-image.png';

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: seo.ogType || 'website',
      locale: 'ar_SA',
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo.title,
          type: 'image/png',
        },
      ],
      url: fullUrl,
      ...(seo.publishedDate && { publishedTime: seo.publishedDate }),
      ...(seo.modifiedDate && { modifiedTime: seo.modifiedDate }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [ogImage],
      creator: '@sahti',
    },
    robots: {
      index: !seo.noindex,
      follow: !seo.nofollow,
      googleBot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      ...(seo.noindex && { googleBot: 'noindex' }),
    },
    alternates: {
      ...(seo.canonicalUrl && { canonical: seo.canonicalUrl }),
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'منصة عربية متخصصة في الصحة واللياقة والتغذية. حاسبات ذكية ومقالات صحية متخصصة',
    inLanguage: 'ar-SA',
    countryOfOrigin: 'SA',
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 200,
      height: 200,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/articles?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://www.facebook.com/sahti',
      'https://twitter.com/sahti',
      'https://instagram.com/sahti',
    ],
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'منصة عربية متخصصة في الصحة واللياقة والتغذية',
    sameAs: [
      'https://www.facebook.com/sahti',
      'https://twitter.com/sahti',
      'https://instagram.com/sahti',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@calc-hub.site',
      availableLanguage: ['ar', 'en'],
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  publishedDate: Date;
  modifiedDate: Date;
  author?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': article.url,
    headline: article.title,
    description: article.description,
    image: {
      '@type': 'ImageObject',
      url: article.image,
      width: 1200,
      height: 630,
    },
    datePublished: article.publishedDate.toISOString(),
    dateModified: article.modifiedDate.toISOString(),
    author: {
      '@type': 'Organization',
      name: article.author || SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'SAR',
      price: '0',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

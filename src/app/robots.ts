import { MetadataRoute } from 'next';

export function GET(): Response {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://calc-hub.site';
  const isProduction = process.env.NODE_ENV === 'production';

  const robots: MetadataRoute.Robots = {
    rules: [
      // Default rules
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/admin',
          '/.well-known',
          '/api',
          '/.next',
          '/node_modules',
          '/*.json$',
          '/*?*sort*',
          '/*?*filter*',
          '/search?',
        ],
        crawlDelay: 1,
      },
      // Google-specific rule
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/admin'],
        crawlDelay: 0,
      },
      // Bing-specific rule
      {
        userAgent: 'Bingbot',
        allow: ['/'],
        disallow: ['/admin'],
        crawlDelay: 1,
      },
      // Block aggressive crawlers
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot'],
        disallow: ['/'],
      },
      // Staging environment - block all crawlers
      ...(isProduction ? [] : [{
        userAgent: '*',
        disallow: ['/'],
      }]),
    ],
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  };

  // Format as robots.txt
  let robotsTxt = '';

  robots.rules?.forEach((rule) => {
    const userAgents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent];
    
    userAgents.forEach((ua) => {
      robotsTxt += `User-agent: ${ua}\n`;
    });

    const allow = Array.isArray(rule.allow) ? rule.allow : rule.allow ? [rule.allow] : [];
    allow.forEach((path) => {
      robotsTxt += `Allow: ${path}\n`;
    });

    const disallow = Array.isArray(rule.disallow) ? rule.disallow : rule.disallow ? [rule.disallow] : [];
    disallow.forEach((path) => {
      robotsTxt += `Disallow: ${path}\n`;
    });

    if (rule.crawlDelay !== undefined) {
      robotsTxt += `Crawl-delay: ${rule.crawlDelay}\n`;
    }

    robotsTxt += '\n';
  });

  // Add sitemap(s)
  robots.sitemap?.forEach((sitemap) => {
    robotsTxt += `Sitemap: ${sitemap}\n`;
  });

  if (robots.host) {
    robotsTxt += `\nHost: ${robots.host}\n`;
  }

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}

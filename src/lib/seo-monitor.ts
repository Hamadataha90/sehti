/**
 * SEO Monitoring and Analytics Utilities
 * تتبع وتحسين SEO بشكل مستمر
 */

interface SEOMetric {
  name: string;
  value: number | string;
  target?: number | string;
  status: 'good' | 'warning' | 'error';
}

export class SEOMonitor {
  /**
   * Check page metadata completeness
   */
  static checkMetadataCompleteness(metadata: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  }): SEOMetric[] {
    const metrics: SEOMetric[] = [];

    // Title check
    const titleLength = metadata.title?.length || 0;
    metrics.push({
      name: 'Title Length',
      value: `${titleLength} characters`,
      target: '50-60',
      status: titleLength >= 30 && titleLength <= 60 ? 'good' : 'warning',
    });

    // Description check
    const descLength = metadata.description?.length || 0;
    metrics.push({
      name: 'Meta Description',
      value: `${descLength} characters`,
      target: '150-160',
      status: descLength >= 120 && descLength <= 160 ? 'good' : 'warning',
    });

    // Keywords check
    const keywordsCount = metadata.keywords?.length || 0;
    metrics.push({
      name: 'Keywords Count',
      value: keywordsCount,
      target: '5-10',
      status: keywordsCount >= 5 && keywordsCount <= 15 ? 'good' : 'warning',
    });

    // OG Image check
    metrics.push({
      name: 'Open Graph Image',
      value: metadata.ogImage ? 'Present' : 'Missing',
      status: metadata.ogImage ? 'good' : 'error',
    });

    return metrics;
  }

  /**
   * Generate SEO score (0-100)
   */
  static calculateSEOScore(metrics: SEOMetric[]): number {
    const goodCount = metrics.filter((m) => m.status === 'good').length;
    const warningCount = metrics.filter((m) => m.status === 'warning').length;
    const errorCount = metrics.filter((m) => m.status === 'error').length;

    // 100 for each good metric, 50 for warning, 0 for error
    const score = (goodCount * 100 + warningCount * 50) / (goodCount + warningCount + errorCount) * 100 / 100;
    return Math.round(score);
  }

  /**
   * Check for common SEO issues
   */
  static checkCommonIssues(html: string): string[] {
    const issues: string[] = [];

    // Check for duplicate meta descriptions
    const metaDescMatches = html.match(/<meta name="description"/g);
    if ((metaDescMatches?.length || 0) > 1) {
      issues.push('Duplicate meta descriptions found');
    }

    // Check for missing alt text in images
    const imgMatches = html.match(/<img[^>]*>/g);
    if (imgMatches) {
      imgMatches.forEach((img) => {
        if (!img.includes('alt=')) {
          issues.push('Image found without alt text');
        }
      });
    }

    // Check heading structure
    const h1Matches = html.match(/<h1[^>]*>/g);
    if (!h1Matches || h1Matches.length === 0) {
      issues.push('No H1 heading found');
    }
    if ((h1Matches?.length || 0) > 1) {
      issues.push('Multiple H1 headings found');
    }

    // Check for missing canonical URL
    if (!html.includes('rel="canonical"')) {
      issues.push('Missing canonical URL');
    }

    return issues;
  }
}

/**
 * Structured Data Helper
 */
export class StructuredDataHelper {
  /**
   * Generate JSON-LD for Knowledge Graph
   */
  static generateKnowledgeGraph(entity: {
    name: string;
    description: string;
    image: string;
    url: string;
    sameAs?: string[];
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Thing',
      name: entity.name,
      description: entity.description,
      image: entity.image,
      url: entity.url,
      sameAs: entity.sameAs || [],
    };
  }

  /**
   * Generate LocalBusiness schema
   */
  static generateLocalBusiness(business: {
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    image: string;
    url: string;
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: business.name,
      description: business.description,
      image: business.image,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address,
        addressLocality: 'Riyadh',
        addressRegion: 'SA',
        postalCode: '12345',
        addressCountry: 'SA',
      },
      telephone: business.phone,
      email: business.email,
      url: business.url,
    };
  }

  /**
   * Generate Event schema
   */
  static generateEvent(event: {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    url: string;
    image: string;
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      eventAttendanceMode: 'OnlineEventAttendanceMode',
      eventStatus: 'EventScheduled',
      location: {
        '@type': 'VirtualLocation',
        url: event.url,
      },
      image: event.image,
      offers: {
        '@type': 'Offer',
        url: event.url,
        price: '0',
        priceCurrency: 'SAR',
        availability: 'InStock',
      },
    };
  }
}

/**
 * Performance SEO Helper
 */
export class PerformanceSEO {
  /**
   * Generate critical CSS
   */
  static getCriticalCSS(): string {
    return `
      html { font-family: 'Cairo', sans-serif; }
      body { margin: 0; padding: 0; background-color: #ffffff; color: #000000; }
      .container { max-width: 1200px; margin: 0 auto; }
      header { padding: 1rem; border-bottom: 1px solid #eee; }
      main { padding: 2rem 1rem; }
    `;
  }

  /**
   * Get preload hints
   */
  static getPreloadHints(): Array<{
    rel: string;
    href: string;
    as?: string;
    type?: string;
  }> {
    return [
      {
        rel: 'preload',
        href: '/fonts/cairo.woff2',
        as: 'font',
        type: 'font/woff2',
      },
      {
        rel: 'prefetch',
        href: '/api/articles',
      },
    ];
  }

  /**
   * Get image optimization hints
   */
  static getImageOptimization() {
    return {
      formats: ['webp', 'avif', 'jpg'],
      sizes: {
        mobile: 640,
        tablet: 1024,
        desktop: 1920,
      },
      quality: {
        high: 85,
        medium: 75,
        low: 65,
      },
    };
  }
}

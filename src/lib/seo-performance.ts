/**
 * Link Prefetching Strategy
 * استراتيجية معالجة مسبقة للوصلات لتحسين التجربة و SEO
 */

export function addPrefetchHints() {
  if (typeof window === 'undefined') return;

  // Prefetch strategy based on user interaction
  const prefetchStrategies = {
    hover: {
      wait: 100,
      timeout: 5000,
    },
    visible: {
      wait: 2000,
      timeout: 10000,
    },
    interaction: {
      wait: 0,
      timeout: 3000,
    },
  };

  return prefetchStrategies;
}

/**
 * Image Optimization Strategy
 */
export const imageOptimization = {
  // Priority images to load first
  priority: ['/logo.png', '/og-image.png', '/hero-image.jpg'],

  // Lazy load threshold (in pixels)
  lazyLoadThreshold: 300,

  // Image sizes for responsive images
  sizes: {
    mobile: 320,
    tablet: 768,
    desktop: 1200,
    large: 1920,
  },

  // Format preference order
  formats: ['avif', 'webp', 'jpg', 'png'],

  // Quality settings
  quality: {
    avif: 65,
    webp: 80,
    jpg: 85,
  },
};

/**
 * Font Loading Strategy
 */
export const fontOptimization = {
  // Use font-display: swap for web fonts
  fontDisplay: 'swap',

  // Preload critical fonts
  preloadFonts: [
    {
      name: 'Cairo',
      weight: '400',
      style: 'normal',
      url: '/fonts/cairo-400.woff2',
    },
    {
      name: 'Cairo',
      weight: '700',
      style: 'normal',
      url: '/fonts/cairo-700.woff2',
    },
  ],

  // Fallback stack
  fallback: 'system-ui, -apple-system, sans-serif',
};

/**
 * Core Web Vitals Optimization
 */
export const coreWebVitals = {
  // Largest Contentful Paint (LCP)
  lcp: {
    target: 2.5, // seconds
    elements: ['h1', 'img', 'video'],
  },

  // First Input Delay (FID) / Interaction to Paint (INP)
  fid: {
    target: 100, // milliseconds
  },

  // Cumulative Layout Shift (CLS)
  cls: {
    target: 0.1,
  },
};

/**
 * Resource Hints
 */
export const resourceHints = {
  // DNS Prefetch
  dnsPrefetch: [
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://fonts.googleapis.com',
  ],

  // Preconnect
  preconnect: [
    {
      href: 'https://fonts.googleapis.com',
      crossOrigin: 'anonymous',
    },
    {
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
  ],

  // Prefetch
  prefetch: [
    '/api/articles',
    '/api/calculators',
  ],

  // Preload
  preload: [
    {
      href: '/fonts/cairo-400.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
  ],
};

/**
 * Critical CSS
 */
export function getCriticalCSS() {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      -webkit-text-size-adjust: 100%;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      background: #ffffff;
      color: #000000;
      line-height: 1.5;
    }

    main {
      min-height: 100vh;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    /* Loading states */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Accessibility */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    /* Focus visible for keyboard navigation */
    *:focus-visible {
      outline: 2px solid #059669;
      outline-offset: 2px;
    }
  `;
}

/**
 * Compression Strategy
 */
export const compressionStrategy = {
  // Enable Brotli compression
  brotli: true,

  // Gzip fallback
  gzip: true,

  // Compression level
  level: 11,

  // Minimum file size to compress (bytes)
  threshold: 860,
};

/**
 * Caching Strategy
 */
export const cachingStrategy = {
  // Browser cache duration
  browser: {
    // Static assets (JS, CSS, images)
    static: {
      maxAge: 31536000, // 1 year
      sMaxAge: 31536000,
      immutable: true,
    },

    // HTML pages
    html: {
      maxAge: 3600, // 1 hour
      sMaxAge: 86400, // 24 hours
    },

    // API responses
    api: {
      maxAge: 300, // 5 minutes
      sMaxAge: 3600, // 1 hour
    },

    // JSON data
    json: {
      maxAge: 300,
      sMaxAge: 3600,
    },
  },
};

/**
 * Analytics Implementation
 */
export const analyticsConfig = {
  // Google Analytics tracking
  googleAnalytics: {
    enabled: true,
    trackingId: process.env.NEXT_PUBLIC_GA_ID,
    events: {
      pageView: 'page_view',
      articleRead: 'article_read',
      calculatorUsed: 'calculator_used',
      leadGenerated: 'lead',
    },
  },

  // Events to track for SEO
  seoEvents: {
    internalLinkClick: 'internal_link',
    externalLinkClick: 'external_link',
    formSubmit: 'form_submit',
    scrollDepth: 'scroll_depth',
    timeOnPage: 'time_on_page',
  },
};

/**
 * Breadcrumb Component for SEO
 */
export function generateBreadcrumbMarkup(
  items: Array<{ label: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url,
    })),
  };
}

/**
 * Lazy Load Configuration
 */
export const lazyLoadConfig = {
  // Intersection Observer options
  options: {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
  },

  // Elements to lazy load
  selectors: [
    'img[data-src]',
    'iframe[data-src]',
    '[data-lazy]',
  ],
};

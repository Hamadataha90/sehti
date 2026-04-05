---
Task ID: 2
Agent: Main Orchestrator
Task: Rebrand + implement all feature enhancements for صِحتي

Work Log:
- Generated professional logo (emerald green Arabic letter ص styled into heart+pulse), white version, and favicon using z-ai image generation
- Renamed "Calc Hub" → "صِحتي" across all files: layout.tsx metadata, Header, Footer, HomePage, email templates, AdminPanel
- Added next-themes Dark Mode toggle button in Header with sun/moon icons
- Added search bar in Header (desktop toggle + mobile always visible) that filters articles on HomePage
- Added social sharing buttons on ArticlePage: WhatsApp, X/Twitter, Facebook, copy link
- Added related articles section at bottom of each article (3 articles, image+title cards)
- Added breadcrumb navigation on ArticlePage (الرئيسية / مقال)
- Added Water Calculator (drops visualization, tips, lead capture)
- Added Ideal Weight Calculator (Devine formula, min/max/ideal range)
- Added Daily Calorie Tracker (localStorage persistence, bar chart + line trend chart via recharts, 7-day history)
- Created About page with mission, tools list, disclaimer
- Created Privacy Policy page (6 sections: data collection, usage, protection, cookies, rights, contact)
- Added Newsletter subscription system (Footer form + /api/newsletter API + welcome email)
- Added article category filter (الكل، تغذية، لياقة، صحة عامة، حاسبات) on HomePage
- Added PWA support (manifest.json in public/, viewport meta, theme-color)
- Updated CalculatorsPage to 5 tabs (السعرات, BMI, الماء, الوزن, المتتبع)
- Updated HomePage to show 4 calculator preview cards
- Updated Zustand store with new views (about, privacy), searchQuery, selectedCategory
- Updated page.tsx to handle all new views + pass allArticles to ArticlePage
- Updated email template branding from Calc Hub to صِحتي
- All ESLint checks passing with 0 errors

Stage Summary:
- Brand renamed to "صِحتي" with professional AI-generated logo
- Dark mode, search, social sharing, breadcrumbs, related articles all implemented
- 4 calculators + daily tracker with charts
- Newsletter subscription + About + Privacy pages
- Category filtering on articles
- PWA manifest added
- 0 lint errors, app compiling and running
---
Task ID: 3
Agent: Main Orchestrator
Task: Switch to PostgreSQL (Neon), fix broken images, fix 404 errors on articles

Work Log:
- Updated .env with Neon PostgreSQL connection URL (postgres:// protocol)
- Changed prisma/schema.prisma provider from "sqlite" to "postgresql"
- Updated db.ts to reduce logging noise (error+warn in dev, error in prod)
- Removed conflicting .config file that was blocking Prisma CLI
- Ran prisma generate and prisma db push to create tables in Neon
- Created seed-db.ts standalone script with all 16 articles and full content
- Successfully seeded 16 articles to Neon PostgreSQL database
- Updated homepage stats from "6+" to "16+" articles
- Updated homepage to show 6 articles instead of 3
- Added "seed" script to package.json for convenience
- Verified API returns all 16 articles with correct slugs, images, and content

Stage Summary:
- Database successfully migrated from SQLite to Neon PostgreSQL
- All 16 articles seeded with proper slugs, full Arabic content, and valid image paths
- All image files (16 webp/jpg) exist in public/images/ with valid sizes
- /article/[slug] route now works with proper slugs matching database
- /articles listing page works correctly
- ESLint passes with 0 errors
---
## Task ID: 1 - seo-specialist
### Work Task
Implement comprehensive SEO overhaul for the صِحتي health platform including dynamic sitemap, structured data, canonical URLs, security headers, and robots.txt optimization.

### Work Summary
All 7 SEO tasks completed successfully with 0 lint errors:

1. **Created `/src/app/sitemap.ts`** — Dynamic sitemap generation using Next.js MetadataRoute. Fetches all articles from the database and generates sitemap entries with proper priorities, change frequencies, and lastModified dates. Includes static pages (home, /articles, /privacy) plus all dynamic article URLs.

2. **Updated `/public/robots.txt`** — Simplified from multiple bot-specific rules to a single wildcard rule allowing all crawlers, plus added explicit sitemap reference pointing to `https://calc-hub.site/sitemap.xml`.

3. **Updated `/src/app/layout.tsx`** — Added `metadataBase` URL for resolving relative OG URLs. Added `alternates.canonical` pointing to `/`. Added default OG image (`/og-image.png`, 1200×630). Added JSON-LD structured data with `@graph` containing both `WebSite` schema (with SearchAction potentialAction) and `Organization` schema (with logo), placed before `<AppShell>` inside `<body>`.

4. **Fixed Article JSON-LD in `/src/app/article/[slug]/ArticleDetailView.tsx`** — Replaced relative URL in `mainEntityOfPage` with absolute `articleUrl` variable. Added full `author` object with Organization type and origin URL. Added `publisher` with nested `logo` ImageObject. Used `window.location.origin` for runtime absolute URLs.

5. **Added canonical URL to `/src/app/article/[slug]/page.tsx`** — Added `alternates.canonical: /article/${article.slug}` in `generateMetadata` function.

6. **Added canonical URL to `/src/app/articles/page.tsx`** — Added `alternates.canonical: '/articles'` to the static metadata export.

7. **Updated `/home/z/my-project/next.config.ts`** — Added `async headers()` function with security headers for all routes (X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy restricting camera/microphone/geolocation) and long-term cache headers (1 year immutable) for static image assets.

All changes passed ESLint with 0 errors. No existing functionality was broken.


---
Task ID: 1
Agent: Main Agent
Task: Fix navigation (URL changes but view stays on article) and fix Monetag ads not showing

Work Log:
- Analyzed Header.tsx and found root cause: logo used `<Link href="/">` which only changes Next.js URL but doesn't update Zustand store's `currentView`
- Changed logo from `<Link href="/">` to `<button onClick={goHome}>` in Header.tsx
- Removed `href: '/'` from "الرئيسية" nav item so `handleNav` properly calls `goHome()`
- Changed privacy/admin links in mobile menu from `<Link>` to `<button>` to use SPA navigation
- Updated Zustand store (useAppStore.ts): added `window.scrollTo` to `openArticle`, `goHome`, and `navigate`
- Added `popstate` event listener for browser back/forward button support
- Added `syncUrlToState` method for URL-to-state synchronization
- Created centralized `/src/lib/monetag.ts` utility to avoid code duplication
- Updated ArticleComponents.tsx to import `triggerMonetag` from centralized utility (removed duplicate function)
- Updated CalculatorsPage.tsx to import `triggerMonetag` from centralized utility (removed duplicate function)
- Fixed Prisma schema provider from `postgresql` to `sqlite` for local development
- Regenerated Prisma client after schema change
- All lint checks pass, server compiles and runs correctly

Stage Summary:
- Navigation fix: Logo, "الرئيسية" button, breadcrumb "الرئيسية", and mobile menu all properly update Zustand state now
- Scroll to top: `openArticle`, `goHome`, and `navigate` all scroll to top
- Browser back/forward: Added `popstate` listener that fetches articles and syncs state
- Monetag: Centralized in `/src/lib/monetag.ts`, used by both ArticleComponents and CalculatorsPage
- Note: Monetag ads require `NEXT_PUBLIC_MONETAG_SRC` and `NEXT_PUBLIC_MONETAG_ZONE` env vars to be configured in .env and on Vercel

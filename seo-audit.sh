#!/usr/bin/env sh
# SEO Audit Commands
# استخدم هذه الأوامر للتحقق من صحة SEO

echo "🔍 SEO Audit - صِحتي"
echo "=================="
echo ""

# 1. Check robots.txt
echo "1️⃣  Checking robots.txt..."
curl -s https://calc-hub.site/robots.txt | head -20
echo ""
echo "---"
echo ""

# 2. Check sitemap.xml
echo "2️⃣  Checking sitemap.xml..."
curl -s https://calc-hub.site/sitemap.xml | head -20
echo ""
echo "---"
echo ""

# 3. Check meta tags
echo "3️⃣  Checking meta tags..."
curl -s https://calc-hub.site | grep -E "meta name=\"description\"|meta property=\"og:" | head -10
echo ""
echo "---"
echo ""

# 4. Check title
echo "4️⃣  Checking page title..."
curl -s https://calc-hub.site | grep "<title" | head -5
echo ""
echo "---"
echo ""

# 5. Check structured data
echo "5️⃣  Checking structured data (JSON-LD)..."
curl -s https://calc-hub.site | grep -E "application/ld\+json" | head -3
echo ""
echo "✅ Audit complete!"
echo ""
echo "📊 Next steps:"
echo "1. Visit Google Search Console: https://search.google.com/search-console"
echo "2. Submit sitemap: https://calc-hub.site/sitemap.xml"
echo "3. Fix any errors shown in Search Console"
echo "4. Wait 24-48 hours for initial crawl"
echo "5. Monitor impressions and clicks in Search Console"

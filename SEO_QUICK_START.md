# إجراءات فورية - SEO Setup Checklist

## ✅ تم إنجازه (Ready to Deploy)

- [x] Metadata Factory (`/src/lib/seo.ts`)
- [x] Schema Markup المتقدم
- [x] Robots.txt محسّن (ديناميكي)
- [x] Sitemap محسّن
- [x] Custom 404 Page
- [x] Layout محسّن
- [x] Performance Optimization
- [x] Security Headers
- [x] Image Optimization Configuration

---

## 🚀 الخطوات التالية (Next Steps)

### 1️⃣ تسجيل الموقع (أهم خطوة)

#### Google Search Console
```bash
1. اذهب إلى: https://search.google.com/search-console/about
2. اضغط على "Start now"
3. أضف domain: calc-hub.site
4. تحقق من ownership (DNS, HTML file, Google Tag Manager إلخ)
5. أرسل sitemap: https://calc-hub.site/sitemap.xml
6. اختبر robots.txt
```

#### Bing Webmaster Tools
```bash
1. اذهب إلى: https://www.bing.com/webmastertools
2. أضف الموقع
3. تحقق من الملكية
4. أرسل sitemap
```

---

### 2️⃣ إضافة Google Analytics

```bash
# انسخ هذا الكود في layout.tsx بعد Toaster
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"
></script>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'YOUR_GA_ID', {
        page_path: window.location.pathname,
      });
    `,
  }}
/>
```

---

### 3️⃣ تحديث Metadata للمقالات

```typescript
// في كل صفحة مقالة:
import { generateMetadata, generateArticleSchema } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'عنوان المقالة - 50-60 حرف',
  description: 'وصف المقالة - 150-160 حرف',
  keywords: ['كلمة1', 'كلمة2', 'كلمة3'],
  ogType: 'article',
  ogImage: '/articles/my-article-image.png',
  publishedDate: new Date('2024-04-08'),
  modifiedDate: new Date('2024-04-08'),
  canonicalUrl: '/article/my-article-slug',
  author: 'صِحتي',
});
```

---

### 4️⃣ إضافة Article Schema لكل المقالات

```typescript
// أضف هذا في الـ component:
const articleSchema = generateArticleSchema({
  title: 'عنوان المقالة',
  description: metadata.description,
  image: '/articles/image.png',
  publishedDate: new Date('2024-04-08'),
  modifiedDate: new Date('2024-04-08'),
  url: 'https://calc-hub.site/article/slug',
});

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(articleSchema),
  }}
/>
```

---

### 5️⃣ تحسين عناوينك الرئيسية (H1)

```typescript
// ✅ صحيح - H1 واحد في الصفحة
<h1>حاسبة السعرات الحرارية - احسب احتياجاتك اليومية</h1>
<h2>كيف تعمل الحاسبة؟</h2>
<h2>فوائد حساب السعرات</h2>

// ❌ خطأ - أكثر من H1
<h1>حاسبة السعرات</h1>
<h1>السعرات الحرارية</h1>

// ❌ خطأ - لا H1 في الصفحة
<h2>ابدأ الآن</h2>
```

---

### 6️⃣ إضافة Alt Text للصور

```typescript
// ✅ صحيح
<img 
  src="/images/bmi-calculator.png"
  alt="حاسبة مؤشر كتلة الجسم - BMI Calculator Online"
  width={400}
  height={300}
/>

// ❌ خطأ
<img src="/images/bmi-calculator.png" alt="صورة" />
```

---

### 7️⃣ الكلمات الرئيسية المقترحة

**صفحة الرئيسية:**
- حاسبات صحية أونلاين
- حاسبة السعرات الحرارية
- حاسبة BMI
- حاسبة الوزن المثالي
- منصة صحة عربية

**صفحة المقالات:**
- مقالات صحية
- نصائح التغذية
- برامج رياضة
- دليل اللياقة

**صفحات داخلية:**
- حسب موضوع كل مقالة/حاسبة

---

### 8️⃣ اختبار المدفوعات

```bash
# اختبر robots.txt
curl https://calc-hub.site/robots.txt

# اختبر sitemap
curl https://calc-hub.site/sitemap.xml

# اختبر metadata
curl https://calc-hub.site | grep -E "<meta name|<meta property|<title"
```

---

### 9️⃣ اختبر Rich Snippets

```bash
1. Google Rich Snippets: https://search.google.com/test/rich-results
   - انسخ رابط الصفحة
   - اختبر الـ schema markup

2. Schema.org Validator: https://validator.schema.org/
   - تحقق من صحة JSON-LD
```

---

### 🔟 موارد مفيدة

```bash
# Performance Testing
- Google Lighthouse: https://pagespeed.web.dev
- GTmetrix: https://gtmetrix.com
- WebPageTest: https://www.webpagetest.org

# SEO Auditing
- Screaming Frog SEO Spider (Free)
- SE Ranking
- Ubersuggest

# Keyword Research
- Google Keyword Planner
- Ahrefs Keywords Explorer
- SE Ranking Keyword Tool
```

---

## 📊 متابعة التقدم

### أسبوع 1-2
- [ ] تسجيل في Search Console و Bing Tools
- [ ] إرسال sitemap
- [ ] اختبار metadata
- [ ] حل أي مشاكل في robots.txt

### أسبوع 3-4
- [ ] مراقبة impressions في Search Console
- [ ] تحسين top articles
- [ ] إضافة internal links
- [ ] تحسين click-through rate

### شهر 2
- [ ] تحليل search queries
- [ ] تحسين articles لـ featured snippets
- [ ] بناء backlinks
- [ ] مراقبة rankings

### شهر 3+
- [ ] قياس ROI
- [ ] توسيع محتوى
- [ ] تحسين معدل التحويل
- [ ] استهداف keywords جديدة

---

## 🎯 معايير النجاح

✅ **شهر الأول:**
- فهرسة 80% من الصفحات
- ظهور في نتائج البحث للـ brand keywords
- 100+ impressions

✅ **شهر الثاني:**
- ترتيب top 10 لـ main keywords
- 1000+ impressions
- 50+ clicks من البحث

✅ **شهر الثالث+:**
- ترتيب top 3 لـ main keywords
- 5000+ impressions/شهر
- 500+ organic clicks/شهر

---

## ⚠️ تجنب هذه الأخطاء

❌ عدم تسجيل الموقع في Search Console
❌ عدم পresponding للـ crawl errors
❌ استخدام same title/description لكل الصفحات
❌ إهمال meta descriptions
❌ عدم optimizing للـ mobile
❌ قليل جداً من المحتوى (thin content)
❌ أخطاء في الـ robots.txt
❌ redirect chains
❌ محتوى مكرر

---

## 📞 دعم وأسئلة متكررة

**س: كب وقت حتى تظهر نتائجي في البحث؟**
ج: 2-4 أسابيع لأول فهرسة، شهر لأول ترتيب

**س: هل أحتاج backlinks؟**
ج: نعم، لكن ابدأ بـ on-page SEO أولاً

**س: هل المحتوى بالعربية صعب؟**
ج: لا، Google يدعم العربية بشكل كامل

**س: كم مقالة احتاج؟**
ج: ابدأ بـ 10-20 مقالة جديدة عالية الجودة

---

**Last Updated:** 2024-04-08
**Status:** ✅ Ready for Production

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Image pool for articles without cover images
const imagePool = [
  '/images/article-17.webp', // vitamins & supplements
  '/images/article-18.webp', // heart health
  '/images/article-19.webp', // yoga & meditation
  '/images/article-20.webp', // diabetes prevention
  '/images/article-21.webp', // skin health
  '/images/article-22.webp', // detox & cleansing
  '/images/article-23.webp', // mental health
  '/images/article-24.webp', // stress management
  '/images/article-25.webp', // healthy breakfast
  '/images/article-26.webp', // superfoods
  '/images/article-27.webp', // immune system
  '/images/article-28.webp', // exercise & aging
  '/images/article-29.webp', // sleep health
  '/images/article-30.webp', // hydration
  '/images/article-31.webp', // weight maintenance
  '/images/article-32.webp', // healthy snacks
  '/images/article-33.webp', // intermittent fasting
  '/images/article-34.webp', // nutrition labels
  '/images/article-35.webp', // fitness motivation
  '/images/article-36.webp', // wellness lifestyle
];

// Keyword-based matching for intelligent image assignment
const keywordMap: Record<string, string> = {
  // Vitamins & supplements
  'فيتامين': '/images/article-17.webp',
  'فيتامينات': '/images/article-17.webp',
  'مكملات': '/images/article-17.webp',
  'مكمل غذائي': '/images/article-17.webp',
  'أوميغا': '/images/article-17.webp',
  'زنك': '/images/article-17.webp',
  'حديد': '/images/article-17.webp',

  // Heart health
  'القلب': '/images/article-18.webp',
  'قلب': '/images/article-18.webp',
  'كولسترول': '/images/article-18.webp',
  'شرايين': '/images/article-18.webp',
  'أمراض القلب': '/images/article-18.webp',

  // Yoga & meditation
  'يوجا': '/images/article-19.webp',
  'تأمل': '/images/article-19.webp',
  'تأملات': '/images/article-19.webp',
  'استرخاء': '/images/article-19.webp',
  'ذهن': '/images/article-19.webp',
  'ميدتيشن': '/images/article-19.webp',

  // Diabetes
  'سكر': '/images/article-20.webp',
  'سكري': '/images/article-20.webp',
  'السكري': '/images/article-20.webp',
  'انسولين': '/images/article-20.webp',
  'نسبة السكر': '/images/article-20.webp',

  // Skin health
  'بشرة': '/images/article-21.webp',
  'جلد': '/images/article-21.webp',
  'جمال': '/images/article-21.webp',
  'شعر': '/images/article-21.webp',
  'عناية': '/images/article-21.webp',
  'تجاعيد': '/images/article-21.webp',

  // Detox
  'ديتوكس': '/images/article-22.webp',
  'تنقية': '/images/article-22.webp',
  'سموم': '/images/article-22.webp',
  'سم': '/images/article-22.webp',
  'تخلص': '/images/article-22.webp',

  // Mental health
  'نفسي': '/images/article-23.webp',
  'نفسية': '/images/article-23.webp',
  'صحة نفسية': '/images/article-23.webp',
  'اكتئاب': '/images/article-23.webp',
  'قلق': '/images/article-23.webp',
  'ذهني': '/images/article-23.webp',

  // Stress
  'توتر': '/images/article-24.webp',
  'ضغط نفسي': '/images/article-24.webp',
  'إرهاق': '/images/article-24.webp',

  // Breakfast / meals
  'إفطار': '/images/article-25.webp',
  'فطور': '/images/article-25.webp',
  'وجبة': '/images/article-25.webp',

  // Superfoods
  'أطعمة': '/images/article-26.webp',
  'سوبر فود': '/images/article-26.webp',
  'مضادات أكسدة': '/images/article-26.webp',
  'أكسدة': '/images/article-26.webp',

  // Immune system
  'مناعة': '/images/article-27.webp',
  'مناعي': '/images/article-27.webp',
  'جهاز مناعي': '/images/article-27.webp',
  'دفاع': '/images/article-27.webp',

  // Exercise & aging
  'كبار السن': '/images/article-28.webp',
  'شيخوخة': '/images/article-28.webp',
  'تقدم العمر': '/images/article-28.webp',

  // Sleep
  'نوم': '/images/article-29.webp',
  'أرق': '/images/article-29.webp',
  'سهر': '/images/article-29.webp',

  // Hydration
  'ترطيب': '/images/article-30.webp',
  'سوائل': '/images/article-30.webp',
  'مشروبات': '/images/article-30.webp',

  // Weight maintenance
  'ثبات الوزن': '/images/article-31.webp',
  'حفظ الوزن': '/images/article-31.webp',

  // Snacks
  'وجبات خفيفة': '/images/article-32.webp',
  'سناك': '/images/article-32.webp',
  'وجبة خفيفة': '/images/article-32.webp',

  // Fasting
  'صيام': '/images/article-33.webp',
  'صيام متقطع': '/images/article-33.webp',
  'إفطار': '/images/article-33.webp',
  'صيام': '/images/article-33.webp',

  // Nutrition labels
  'ملصق': '/images/article-34.webp',
  'مواد حافظة': '/images/article-34.webp',
  'إضافات غذائية': '/images/article-34.webp',
  'مكونات': '/images/article-34.webp',

  // Fitness motivation
  'تحفيز': '/images/article-35.webp',
  'دافع': '/images/article-35.webp',
  'عضوي': '/images/article-35.webp',

  // Wellness
  'عافية': '/images/article-36.webp',
  'رعاية ذاتية': '/images/article-36.webp',
  'توازن': '/images/article-36.webp',
  'حياة صحية': '/images/article-36.webp',
};

function findBestImage(title: string, availableImages: string[]): string {
  // Search for keyword matches in title
  for (const [keyword, imagePath] of Object.entries(keywordMap)) {
    if (title.includes(keyword) && availableImages.includes(imagePath)) {
      return imagePath;
    }
  }
  // Default: pick the next available image
  return availableImages[0] || imagePool[0];
}

export async function POST() {
  try {
    // Get all articles
    const allArticles = await db.article.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Find articles with empty or null coverImage
    const articlesWithoutImages = allArticles.filter(
      (a) => !a.coverImage || a.coverImage.trim() === ''
    );

    if (articlesWithoutImages.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'كل المقالات ليها صور بالفعل!',
        updated: 0,
      });
    }

    // Find which images are NOT already used by other articles
    const usedImages = new Set(
      allArticles
        .filter((a) => a.coverImage && a.coverImage.trim() !== '')
        .map((a) => a.coverImage)
    );

    // Available images from the new pool
    const availableNewImages = imagePool.filter((img) => !usedImages.has(img));

    // If we need more images than available, also include some already used ones
    let imageQueue = [...availableNewImages];
    if (imageQueue.length < articlesWithoutImages.length) {
      imageQueue = [...imagePool];
    }

    // Track which images we've assigned
    const assignedImages = new Set<string>();
    const updatedArticles: { id: string; title: string; coverImage: string }[] = [];

    for (const article of articlesWithoutImages) {
      // Find best matching image from available pool
      const bestImage = findBestImage(article.title, imageQueue);

      // Update the article
      await db.article.update({
        where: { id: article.id },
        data: { coverImage: bestImage },
      });

      // Remove used image from queue and track assignment
      imageQueue = imageQueue.filter((img) => img !== bestImage);
      assignedImages.add(bestImage);

      updatedArticles.push({
        id: article.id,
        title: article.title,
        coverImage: bestImage,
      });
    }

    return NextResponse.json({
      success: true,
      message: `تم تحديث ${updatedArticles.length} مقالة بصور جديدة!`,
      updated: updatedArticles.length,
      articles: updatedArticles,
    });
  } catch (error) {
    console.error('Error fixing images:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الصور' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allArticles = await db.article.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const withoutImages = allArticles.filter(
      (a) => !a.coverImage || a.coverImage.trim() === ''
    );

    const withImages = allArticles.filter(
      (a) => a.coverImage && a.coverImage.trim() !== ''
    );

    return NextResponse.json({
      total: allArticles.length,
      withImages: withImages.length,
      withoutImages: withoutImages.length,
      articlesWithoutImages: withoutImages.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        coverImage: a.coverImage,
      })),
    });
  } catch (error) {
    console.error('Error checking images:', error);
    return NextResponse.json(
      { error: 'فشل في فحص الصور' },
      { status: 500 }
    );
  }
}

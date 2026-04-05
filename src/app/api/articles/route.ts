import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const articles = await db.article.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل المقالات' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, calculatorType } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة ضرورية' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'هذا الرابط موجود بالفعل' },
        { status: 409 }
      );
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt ?? '',
        coverImage: coverImage ?? '',
        calculatorType: calculatorType ?? null,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'فشل في إنشاء المقال' },
      { status: 500 }
    );
  }
}

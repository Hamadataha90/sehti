import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await db.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل المقال' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, calculatorType } = body;

    const article = await db.article.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverImage !== undefined && { coverImage }),
        ...(calculatorType !== undefined && { calculatorType }),
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث المقال' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.article.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'فشل في حذف المقال' },
      { status: 500 }
    );
  }
}

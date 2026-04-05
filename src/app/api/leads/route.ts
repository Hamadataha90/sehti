import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, calories, bmi, goal } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'بريد إلكتروني غير صالح' },
        { status: 400 }
      );
    }

    const lead = await db.lead.create({
      data: {
        email,
        calories: calories ?? null,
        bmi: bmi ?? null,
        goal: goal ?? null,
      },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'فشل في تسجيل البيانات' },
      { status: 500 }
    );
  }
}

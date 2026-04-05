import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are not set');
      return NextResponse.json(
        { error: 'خدمة تسجيل الدخول غير متوفرة حاليًا' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      );
    }

    const token = await signToken({ email, role: 'admin' });

    return NextResponse.json({ token, email });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'فشل في تسجيل الدخول' },
      { status: 500 }
    );
  }
}

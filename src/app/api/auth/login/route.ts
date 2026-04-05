import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';

// Default admin credentials (in production, use env variables)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@calchub.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Simple credential check
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
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

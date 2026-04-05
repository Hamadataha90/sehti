import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'بريد إلكتروني غير صالح' }, { status: 400 });
    }

    // Save as a lead with newsletter goal
    const { db } = await import('@/lib/db');
    await db.lead.create({
      data: {
        email,
        goal: 'نشرة بريدية',
      },
    });

    // Optionally send welcome email
    const apiKey = process.env.EMAIL_API_KEY;
    const fromEmail = process.env.EMAIL_FROM;
    if (apiKey && fromEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: '🎉 مرحبًا بك في صِحتي!',
          html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>body{font-family:'Segoe UI',Tahoma,sans-serif;direction:rtl;background:#f5f5f5;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#059669,#10b981);padding:30px;text-align:center;color:white}.content{padding:30px}.footer{background:#f9fafb;padding:20px;text-align:center;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb}</style>
</head><body>
<div class="container">
  <div class="header"><h1 style="margin:0;font-size:24px">🌿 صِحتي</h1><p style="margin:8px 0 0;opacity:0.9;font-size:14px">حاسباتك الصحية الذكية</p></div>
  <div class="content">
    <h2 style="color:#1f2937;text-align:center;">مرحبًا بك! 🎉</h2>
    <p style="color:#4b5563;line-height:1.8;">شكرًا لاشتراكك في النشرة البريدية لمنصة <strong>صِحتي</strong>! سنرسل لك أحدث المقالات والنصائح الصحية.</p>
    <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:20px;margin:20px 0">
      <h3 style="color:#065f46;margin:0 0 12px;">✅ يمكنك الآن:</h3>
      <ul style="margin:0;padding:0 20px;color:#047857;line-height:2">
        <li>استخدام حاسبات السعرات و BMI والماء</li>
        <li>قراءة مقالات صحية متخصصة</li>
        <li>تتبع سعراتك اليومية</li>
      </ul>
    </div>
  </div>
  <div class="footer"><p>© ${new Date().getFullYear()} صِحتي — جميع الحقوق محفوظة</p></div>
</div></body></html>`,
        }),
      });
    }

    return NextResponse.json({ success: true, message: 'تم الاشتراك بنجاح' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'فشل في الاشتراك' }, { status: 500 });
  }
}

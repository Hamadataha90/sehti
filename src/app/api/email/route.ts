import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, calories, bmi, goal } = body;

    const apiKey = process.env.EMAIL_API_KEY;
    const fromEmail = process.env.EMAIL_FROM;

    if (!apiKey || !fromEmail) {
      console.warn('Email API not configured. Skipping email send.');
      return NextResponse.json({ success: true, message: 'تم التسجيل بنجاح' });
    }

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: '🎉 خطة غذائية مجانية من صِحتي',
        html: buildEmailHtml(calories, bmi, goal),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend API error:', errorData);
      return NextResponse.json(
        { error: 'فشل في إرسال البريد' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'تم إرسال البريد بنجاح' });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'فشل في إرسال البريد' },
      { status: 500 }
    );
  }
}

function buildEmailHtml(calories: number | undefined, bmi: number | undefined, goal: string | undefined): string {
  const caloriesText = calories ? `${Math.round(calories)} سعرة حرارية يوميًا` : 'غير محدد';
  const bmiText = bmi ? bmi.toFixed(1) : 'غير محدد';
  const goalText = goal ?? 'تحسين الصحة العامة';

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #059669, #10b981); padding: 30px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 30px; }
    .result-card { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .result-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #d1fae5; }
    .result-item:last-child { border-bottom: none; }
    .result-label { font-weight: 600; color: #065f46; }
    .result-value { color: #059669; font-weight: 700; }
    .advice { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .advice h3 { color: #92400e; margin: 0 0 12px; font-size: 16px; }
    .advice ul { margin: 0; padding: 0 20px; color: #78350f; }
    .advice li { margin: 8px 0; line-height: 1.6; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
    .cta-button { display: inline-block; background: #059669; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌿 صِحتي</h1>
      <p>حاسباتك الصحية الذكية</p>
    </div>
    <div class="content">
      <h2 style="color: #1f2937; text-align: center;">نتائجك الشخصية</h2>
      
      <div class="result-card">
        <div class="result-item">
          <span class="result-label">🔥 احتياجك اليومي:</span>
          <span class="result-value">${caloriesText}</span>
        </div>
        <div class="result-item">
          <span class="result-label">📊 مؤشر كتلة الجسم:</span>
          <span class="result-value">${bmiText}</span>
        </div>
        <div class="result-item">
          <span class="result-label">🎯 هدفك:</span>
          <span class="result-value">${goalText}</span>
        </div>
      </div>

      <div class="advice">
        <h3>💡 نصائح مهمة لتحقيق هدفك:</h3>
        <ul>
          <li>اشرب 8 أكواب من الماء على الأقل يوميًا</li>
          <li>قم بتقسيم وجباتك إلى 4-5 وجبات صغيرة</li>
          <li>احرص على تناول البروتين في كل وجبة</li>
          <li>مارس الرياضة لمدة 30 دقيقة يوميًا على الأقل</li>
          <li>تجنب الأطعمة المصنعة والمشروبات الغازية</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? '#'}" class="cta-button">
          🔥 زُر موقعنا للمزيد من الأدوات الصحية
        </a>
      </div>
    </div>
    <div class="footer">
      <p>تم إرسال هذا البريد بناءً على طلبك من صِحتي</p>
      <p>© ${new Date().getFullYear()} صِحتي - جميع الحقوق محفوظة</p>
    </div>
  </div>
</body>
</html>`;
}

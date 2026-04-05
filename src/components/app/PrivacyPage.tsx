'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';

export function PrivacyPage() {
  const { goHome } = useAppStore();

  const sections = [
    {
      num: '1',
      title: 'المعلومات التي نجمعها',
      items: [
        { strong: 'عند استخدام الحاسبات:', text: 'لا نخزن أي بيانات شخصية. الحسابات تتم في متصفحك فقط.' },
        { strong: 'عند الاشتراك بالنشرة البريدية:', text: 'نجمع عنوان بريدك الإلكتروني فقط.' },
        { strong: 'عند طلب خطة غذائية:', text: 'نجمع بريدك الإلكتروني ونتائج الحاسبة التي اخترت مشاركتها.' },
      ],
    },
    {
      num: '2',
      title: 'كيف نستخدم معلوماتك',
      items: [
        { text: 'إرسال نتائج الحاسبات عبر البريد الإلكتروني عند طلبك' },
        { text: 'إرسال النشرة البريدية إذا اشتركت' },
        { text: 'تحسين محتوى الموقع بناءً على تفاعل المستخدمين' },
      ],
    },
    {
      num: '3',
      title: 'حماية بياناتك',
      text: 'نلتزم بأعلى معايير حماية البيانات. لا نبيع أو نشارك معلوماتك الشخصية مع أي طرف ثالث. يتم تخزين البيانات بشكل آمن باستخدام تقنيات التشفير الحديثة.',
    },
    {
      num: '4',
      title: 'ملفات تعريف الارتباط (Cookies)',
      text: 'نستخدم ملفات تعريف الارتباط الضرورية فقط لتشغيل الموقع بشكل صحيح. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال إعدادات المتصفح.',
    },
    {
      num: '5',
      title: 'حقوقك',
      items: [
        { text: 'حق الوصول إلى بياناتك الشخصية' },
        { text: 'حق طلب حذف بياناتك' },
        { text: 'حق إلغاء الاشتراك في النشرة البريدية في أي وقت' },
      ],
    },
    {
      num: '6',
      title: 'تواصل معنا',
      text: 'لأي استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني.',
    },
  ];

  return (
    <div className="page-transition mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button onClick={goHome} className="link-hover hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">الرئيسية</button>
        <span className="text-border/60">/</span>
        <span className="text-foreground font-medium">سياسة الخصوصية</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">📜 سياسة الخصوصية</h1>
      <p className="text-muted-foreground mb-8">آخر تحديث: {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="space-y-5">
        {sections.map((section) => (
          <section key={section.num} className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-border/70 transition-all duration-300">
            <h2 className="text-lg font-bold text-foreground mb-3">{section.num}. {section.title}</h2>
            {section.text && <p className="text-muted-foreground text-sm leading-7">{section.text}</p>}
            {section.items && (
              <ul className="list-disc list-inside space-y-2.5 text-muted-foreground text-sm leading-7">
                {section.items.map((item, i) => (
                  <li key={i}>
                    {item.strong && <strong className="text-foreground font-semibold">{item.strong}</strong>}
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="text-center pt-8">
        <Button onClick={goHome} variant="outline" className="btn-press gap-2 rounded-xl border-border/60 hover:border-border transition-all duration-200">
          → العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}

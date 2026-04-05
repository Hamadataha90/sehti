'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function AboutPage() {
  const { goHome } = useAppStore();

  const tools = [
    { icon: '🔥', title: 'حاسبة السعرات', desc: 'احسب احتياجك اليومي باستخدام معادلة Mifflin-St Jeor' },
    { icon: '📊', title: 'حاسبة BMI', desc: 'تعرف على مؤشر كتلة جسمك' },
    { icon: '💧', title: 'حاسبة الماء', desc: 'احسب كمية الماء اليومية المطلوبة' },
    { icon: '⚖️', title: 'الوزن المثالي', desc: 'اكتشف الوزن المناسب لطولك' },
    { icon: '📈', title: 'متتبع السعرات', desc: 'تتبع استهلاكك اليومي من السعرات' },
    { icon: '📖', title: 'مقالات صحية', desc: 'محتوى عربي موثوق في التغذية واللياقة' },
  ];

  return (
    <div className="page-transition mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button onClick={goHome} className="link-hover hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">الرئيسية</button>
        <span className="text-border/60">/</span>
        <span className="text-foreground font-medium">من نحن</span>
      </nav>

      <div className="text-center mb-10">
        <div className="inline-block transition-transform duration-300 hover:scale-110 hover:rotate-3">
          <Image src="/logo.png" alt="صِحتي" width={80} height={80} className="mx-auto rounded-2xl mb-4" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">مرحبًا بك في صِحتي</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          منصة عربية متخصصة في الصحة واللياقة والتغذية، نسعى لتقديم أدوات ومحتوى موثوق يساعدك في تحسين صحتك
        </p>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-border/70 transition-all duration-300">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">🎯 رسالتنا</h2>
          <p className="text-muted-foreground leading-8">
            نؤمن أن الصحة هي أعظم ثروة يمتلكها الإنسان. لذلك أنشأنا &quot;صِحتي&quot; لتكون مرجعك العربي الأول للحاسبات الصحية والمقالات الموثوقة. هدفنا هو تمكين كل عربي من اتخاذ قرارات صحية مبنية على علم ومعرفة.
          </p>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-border/70 transition-all duration-300">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">🛠️ ما نقدمه</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {tools.map((item) => (
              <div key={item.title} className="flex gap-3 p-3.5 rounded-xl bg-muted/20 border border-transparent hover:bg-muted/40 hover:border-border/40 transition-all duration-200 hover:shadow-sm group cursor-default">
                <div className="text-2xl shrink-0 transition-transform duration-200 group-hover:scale-110">{item.icon}</div>
                <div><h3 className="font-semibold text-foreground text-sm">{item.title}</h3><p className="text-xs text-muted-foreground mt-0.5 leading-5">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-border/70 transition-all duration-300">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">⚖️ إخلاء مسؤولية</h2>
          <p className="text-muted-foreground leading-8 text-sm">
            المحتوى المقدم على منصة &quot;صِحتي&quot; لأغراض تثقيفية وتوعوية فقط ولا يُغني بأي حال من حالات عن استشارة الطبيب المختص أو أخصائي التغذية. النتائج المعروضة هي تقديرات ولا تعتبر تشخيصًا طبيًا. يرجى استشارة متخصص قبل اتخاذ أي قرار يتعلق بصحتك.
          </p>
        </section>

        <div className="text-center pt-4">
          <Button onClick={goHome} variant="outline" className="btn-press gap-2 rounded-xl border-border/60 hover:border-border transition-all duration-200">
            → العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}

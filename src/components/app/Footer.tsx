'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';

export function Footer() {
  const { navigate, goHome } = useAppStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('يرجى إدخال بريد إلكتروني صالح');
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      toast.success('تم الاشتراك بنجاح! شكرًا لك 🎉');
    } catch {
      toast.error('حدث خطأ أثناء الاشتراك');
    } finally {
      setLoading(false);
    }
  };

  const footerLinks = [
    { label: 'الرئيسية', action: goHome },
    { label: 'الحاسبات', action: () => navigate('calculators') },
    { label: 'من نحن', action: () => navigate('about') },
    { label: 'سياسة الخصوصية', action: () => navigate('privacy') },
  ];

  const toolLinks = [
    { label: '🔥 حاسبة السعرات', action: () => navigate('calculators') },
    { label: '📊 حاسبة BMI', action: () => navigate('calculators') },
    { label: '💧 حاسبة الماء', action: () => navigate('calculators') },
    { label: '⚖️ الوزن المثالي', action: () => navigate('calculators') },
  ];

  return (
    <footer className="mt-auto border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button onClick={goHome} className="flex items-center gap-2.5 mb-4 group">
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Image src="/logo.png" alt="صِحتي" width={32} height={32} className="rounded-lg" />
              </div>
              <span className="text-lg font-bold text-foreground transition-colors duration-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">صِحتي</span>
            </button>
            <p className="text-sm text-muted-foreground leading-7 mb-4">
              منصة عربية متخصصة في الصحة واللياقة والتغذية. نقدم لك أدوات ومقالات موثوقة لتحسين صحتك.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">روابط سريعة</h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={link.action} className="link-hover text-sm text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">أدواتنا</h3>
            <ul className="space-y-2.5">
              {toolLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={link.action} className="link-hover text-sm text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">📧 النشرة البريدية</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-6">اشترك ليصلك جديد المقالات والنصائح الصحية</p>
            {!subscribed ? (
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm h-10 border-border/60 focus-visible:ring-emerald-600/30 transition-all duration-200 rounded-lg"
                  dir="ltr"
                />
                <Button onClick={handleSubscribe} disabled={loading} size="sm" className="btn-press bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 h-10 rounded-lg shadow-sm shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/25 transition-all duration-300">
                  {loading ? '⏳' : 'اشترك'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-[scaleIn_0.3s_ease-out]">
                ✅ تم الاشتراك!
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            © {new Date().getFullYear()} صِحتي — جميع الحقوق محفوظة. المحتوى لأغراض تثقيفية فقط ولا يُغني عن استشارة الطبيب.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            صُنع بـ 💚 لصحتك
          </div>
        </div>
      </div>
    </footer>
  );
}

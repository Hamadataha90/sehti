import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة (404)',
  description: 'عذراً، الصفحة التي تبحث عنها غير موجودة. عد إلى الصفحة الرئيسية أو تصفح مقالاتنا.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-emerald-600 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">الصفحة غير موجودة</h2>
          <p className="text-lg text-muted-foreground mb-8">
            عذراً، الصفحة التي تبحث عنها لا توجد أو تم نقلها
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
          <Link
            href="/articles"
            className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
          >
            تصفح المقالات
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            هل تحتاج مساعدة؟{' '}
            <Link href="/contact" className="text-emerald-600 hover:underline">
              تواصل معنا
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

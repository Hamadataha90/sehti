'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string;
  calculatorType: string | null;
  createdAt: string;
}

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAdminToken, navigate } = useAppStore();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('يرجى إدخال البريد وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'فشل تسجيل الدخول');
        return;
      }

      setAdminToken(data.token);
      toast.success('تم تسجيل الدخول بنجاح!');
      navigate('admin');
    } catch {
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md border-border/60">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <span className="text-2xl">🔒</span>
          </div>
          <CardTitle className="text-xl">لوحة التحكم</CardTitle>
          <p className="text-sm text-muted-foreground">أدخل بيانات المشرف للوصول</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">البريد الإلكتروني</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@sihatti.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">كلمة المرور</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            {loading ? '⏳ جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => useAppStore.getState().navigate('home')}
          >
            → العودة للرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminPanel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { setAdminToken, navigate, goHome } = useAppStore();

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data.articles ?? []);
    } catch {
      toast.error('فشل في تحميل المقالات');
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchArticles();
  });

  const handleLogout = () => {
    setAdminToken(null);
    toast.success('تم تسجيل الخروج');
    goHome();
  };

  const handleSeed = async () => {
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchArticles();
      }
    } catch {
      toast.error('فشل في تهيئة البيانات');
    }
  };

  const handleFixImages = async () => {
    try {
      toast.loading('جارٍ إصلاح الصور المفقودة...', { id: 'fix-images' });
      const response = await fetch('/api/articles/fix-images', { method: 'POST' });
      const data = await response.json();
      toast.dismiss('fix-images');
      if (data.success) {
        toast.success(data.message);
        fetchArticles();
      } else {
        toast.error(data.error || 'فشل في إصلاح الصور');
      }
    } catch {
      toast.dismiss('fix-images');
      toast.error('حدث خطأ أثناء إصلاح الصور');
    }
  };

  return (
    <div className="page-transition mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            ⚙️ لوحة التحكم
          </h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة المقالات والمحتوى</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <CreateArticleDialog onCreated={fetchArticles} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleFixImages}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            🖼️ إصلاح الصور المفقودة
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
          >
            🌱 تهيئة بيانات تجريبية
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
          >
            🚪 تسجيل الخروج
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Articles List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">لا توجد مقالات</h2>
          <p className="text-muted-foreground mb-4">ابدأ بإنشاء مقالك الأول أو قم بتهيئة بيانات تجريبية</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <ArticleRow
              key={article.id}
              article={article}
              onDeleted={fetchArticles}
              onUpdated={fetchArticles}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleRow({ article, onDeleted, onUpdated }: {
  article: Article;
  onDeleted: () => void;
  onUpdated: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{article.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            /articles/{article.slug}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {new Date(article.createdAt).toLocaleDateString('ar-SA')}
            </Badge>
            {article.calculatorType && (
              <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                {article.calculatorType === 'calories' ? '🔥 سعرات' : '📊 BMI'}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <EditArticleDialog article={article} onUpdated={onUpdated} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                🗑️
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>حذف المقال</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من حذف &quot;{article.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await fetch(`/api/articles/${article.id}`, { method: 'DELETE' });
                      toast.success('تم حذف المقال');
                      onDeleted();
                    } catch {
                      toast.error('فشل في حذف المقال');
                    }
                  }}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function CreateArticleDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [calculatorType, setCalculatorType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !slug || !content) {
      toast.error('العنوان والرابط والمحتوى مطلوبان');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          coverImage,
          calculatorType: calculatorType || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'فشل في إنشاء المقال');
        return;
      }

      toast.success('تم إنشاء المقال بنجاح!');
      setOpen(false);
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setCoverImage('');
      setCalculatorType('');
      onCreated();
    } catch {
      toast.error('حدث خطأ أثناء إنشاء المقال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          ✏️ إنشاء مقال
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء مقال جديد</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>عنوان المقال *</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // Auto-generate slug
                if (!slug) {
                  setSlug(e.target.value.replace(/\s+/g, '-'));
                }
              }}
              placeholder="عنوان المقال بالعربية"
            />
          </div>
          <div className="space-y-2">
            <Label>الرابط (Slug) *</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="مثال: التغذية-السليمة"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>ملخص</Label>
            <Input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="ملخص قصير للمقال"
            />
          </div>
          <div className="space-y-2">
            <Label>رابط صورة الغلاف</Label>
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>نوع الحاسبة (اختياري)</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={calculatorType === 'calories' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCalculatorType(calculatorType === 'calories' ? '' : 'calories')}
                className={calculatorType === 'calories' ? 'bg-emerald-600' : ''}
              >
                🔥 سعرات
              </Button>
              <Button
                type="button"
                variant={calculatorType === 'bmi' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCalculatorType(calculatorType === 'bmi' ? '' : 'bmi')}
                className={calculatorType === 'bmi' ? 'bg-emerald-600' : ''}
              >
                📊 BMI
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>المحتوى (Markdown) *</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب محتوى المقال هنا باستخدام Markdown..."
              rows={12}
              className="font-mono text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? '⏳ جارٍ الإنشاء...' : '✅ إنشاء المقال'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditArticleDialog({ article, onUpdated }: {
  article: Article;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [excerpt, setExcerpt] = useState(article.excerpt ?? '');
  const [content, setContent] = useState(article.content);
  const [coverImage, setCoverImage] = useState(article.coverImage);
  const [calculatorType, setCalculatorType] = useState(article.calculatorType ?? '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !slug || !content) {
      toast.error('العنوان والرابط والمحتوى مطلوبان');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          coverImage,
          calculatorType: calculatorType || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'فشل في تحديث المقال');
        return;
      }

      toast.success('تم تحديث المقال بنجاح!');
      setOpen(false);
      onUpdated();
    } catch {
      toast.error('حدث خطأ أثناء تحديث المقال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
          ✏️
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل المقال</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>عنوان المقال *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>الرابط (Slug) *</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label>ملخص</Label>
            <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>رابط صورة الغلاف</Label>
            <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label>نوع الحاسبة (اختياري)</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={calculatorType === 'calories' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCalculatorType(calculatorType === 'calories' ? '' : 'calories')}
                className={calculatorType === 'calories' ? 'bg-emerald-600' : ''}
              >
                🔥 سعرات
              </Button>
              <Button
                type="button"
                variant={calculatorType === 'bmi' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCalculatorType(calculatorType === 'bmi' ? '' : 'bmi')}
                className={calculatorType === 'bmi' ? 'bg-emerald-600' : ''}
              >
                📊 BMI
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>المحتوى (Markdown) *</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? '⏳ جارٍ التحديث...' : '✅ حفظ التعديلات'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

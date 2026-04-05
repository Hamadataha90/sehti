'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileEntry { path: string; content: string; }

const SETUP_COMMANDS = `# 1. Create Next.js project
npx create-next-app@latest sihatti --typescript --tailwind --eslint --app --src-dir
cd sihatti

# 2. Install extra packages
npm install jose next-themes react-markdown recharts zustand sonner

# 3. Install shadcn/ui
npx shadcn@latest init -y
npx shadcn@latest add button input label card tabs select dialog alert-dialog sheet badge separator skeleton toast sonner

# 4. Copy all files from the Code page (replace existing files)
# Then run:
npx prisma db push
npm run dev
`;

export function CodePage() {
  const { goHome } = useAppStore();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  useEffect(() => {
    async function loadFiles() {
      try {
        const res = await fetch('/api/download/files');
        const data = await res.json();
        setFiles(data.files ?? []);
      } catch {
        toast.error('فشل في تحميل الملفات');
      } finally {
        setLoading(false);
      }
    }
    loadFiles();
  }, []);

  const copyFile = async (file: FileEntry) => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopiedFile(file.path);
      toast.success(`تم نسخ: ${file.path}`);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch {
      toast.error('فشل في النسخ');
    }
  };

  const copyAllFiles = () => {
    const text = files.map((f) => `// === ${f.path} ===\n${f.content}`).join('\n\n');
    navigator.clipboard.writeText(text).then(() => toast.success('تم نسخ كل الملفات!')).catch(() => toast.error('فشل في النسخ'));
  };

  const copySetupCommands = () => {
    navigator.clipboard.writeText(SETUP_COMMANDS).then(() => toast.success('تم نسخ أوامر التثبيت!')).catch(() => toast.error('فشل في النسخ'));
  };

  const filtered = searchTerm
    ? files.filter((f) => f.path.toLowerCase().includes(searchTerm.toLowerCase()))
    : files;

  const getFileIcon = (path: string) => {
    if (path.endsWith('.css')) return '🎨';
    if (path.endsWith('.prisma')) return '🗄️';
    if (path.endsWith('.json')) return '📋';
    if (path.includes('api/')) return '🔌';
    return '📄';
  };

  return (
    <div className="page-transition min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">📦 كود مشروع صِحتي</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            انسخ الملفات واحد واحد أو كلهم معًا — ثم اتبع خطوات التثبيت
          </p>
        </div>

        {/* Setup Steps */}
        <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 mb-8">
          <h2 className="text-lg font-bold text-emerald-800 mb-4">🚀 خطوات التثبيت</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">1</span>
              <div>
                <p className="font-semibold text-foreground text-sm">أنشئ مشروع Next.js جديد</p>
                <code className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded block mt-1" dir="ltr">npx create-next-app@latest sihatti --typescript --tailwind --eslint --app --src-dir</code>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">2</span>
              <div>
                <p className="font-semibold text-foreground text-sm">ثبّت الحزم الإضافية</p>
                <code className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded block mt-1" dir="ltr">npm install jose next-themes react-markdown recharts zustand sonner</code>
                <code className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded block mt-1" dir="ltr">npx shadcn@latest init -y && npx shadcn@latest add button input label card tabs select dialog alert-dialog sheet badge separator skeleton toast sonner</code>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">3</span>
              <div>
                <p className="font-semibold text-foreground text-sm">انسخ الملفات من القائمة بالأسفل</p>
                <p className="text-xs text-muted-foreground mt-1">اضغط &quot;نسخ&quot; على كل ملف واستبدله في المشروع</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">4</span>
              <div>
                <p className="font-semibold text-foreground text-sm">شغّل المشروع</p>
                <code className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded block mt-1" dir="ltr">npx prisma db push && npm run dev</code>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">5</span>
              <div>
                <p className="font-semibold text-foreground text-sm">حمّل صور المقالات من هنا</p>
                <p className="text-xs text-muted-foreground mt-1">افتح /api/download في المتصفح لتحميل ملف ZIP يشمل كل شيء</p>
              </div>
            </div>
          </div>
          <Button onClick={copySetupCommands} variant="outline" size="sm" className="mt-4 bg-white">
            📋 نسخ أوامر التثبيت
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button onClick={copyAllFiles} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            📋 نسخ كل الملفات معًا
          </Button>
          <Button variant="outline" onClick={() => {
            const a = document.createElement('a');
            a.href = '/api/download';
            a.download = 'sihatti-project.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}>
            ⬇️ تحميل كملف ZIP
          </Button>
          <Button variant="outline" onClick={goHome}>
            → العودة للتطبيق
          </Button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="search"
            placeholder="🔍 ابحث عن ملف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
          />
        </div>

        {/* File count */}
        <p className="text-sm text-muted-foreground mb-4">
          عرض {filtered.length} من {files.length} ملف
        </p>

        {/* Files List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((file) => (
              <div key={file.path} className="rounded-xl border border-border/60 bg-card overflow-hidden">
                {/* File Header */}
                <button
                  onClick={() => copyFile(file)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-right"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{getFileIcon(file.path)}</span>
                    <code className="text-sm font-medium text-foreground truncate">{file.path}</code>
                  </div>
                  <span className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                    copiedFile === file.path
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-muted text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700'
                  }`}>
                    {copiedFile === file.path ? '✅ تم النسخ' : '📋 نسخ'}
                  </span>
                </button>
                {/* Code Preview */}
                <div className="border-t border-border/40">
                  <pre className="max-h-48 overflow-auto p-4 bg-muted/20 text-xs leading-6" dir="ltr" style={{ fontFamily: 'Fira Code, monospace' }}>
                    <code>{file.content.slice(0, 2000)}{file.content.length > 2000 ? '\n\n... (اضغط نسخ للمحتوى الكامل)' : ''}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

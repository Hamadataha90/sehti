'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { triggerMonetag } from '@/lib/monetag';

// ===== Types =====
interface CalorieResult { tdee: number; lose: number; maintain: number; gain: number; }
interface BMIResult { bmi: number; category: string; color: string; }
interface WaterResult { liters: number; cups: number; }
interface IdealWeightResult { min: number; max: number; ideal: number; }
interface DayEntry { date: string; calories: number; goal: number; }

// ===== Main Page =====
export function CalculatorsPage() {
  return (
    <div className="page-transition mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">🧮 حاسباتك الصحية</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">أدوات تفاعلية لمساعدتك في فهم احتياجاتك الصحية وتحقيق أهدافك</p>
      </div>
      <Tabs defaultValue="calories" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6 h-auto gap-1 bg-muted/50 p-1">
          {[
            { value: 'calories', label: '🔥 السعرات' },
            { value: 'bmi', label: '📊 BMI' },
            { value: 'water', label: '💧 الماء' },
            { value: 'ideal', label: '⚖️ الوزن' },
            { value: 'tracker', label: '📈 المتتبع' },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="btn-press rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-emerald-600/25 transition-all duration-200"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="calories"><CalorieCalculator /></TabsContent>
        <TabsContent value="bmi"><BMICalculator /></TabsContent>
        <TabsContent value="water"><WaterCalculator /></TabsContent>
        <TabsContent value="ideal"><IdealWeightCalculator /></TabsContent>
        <TabsContent value="tracker"><DailyTracker /></TabsContent>
      </Tabs>
    </div>
  );
}

// ===== Shared Components =====
function ResultCard({ title, value, unit, color, highlight }: { title: string; value: string | number; unit?: string; color?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 text-center transition-all duration-200 ${
      highlight
        ? 'bg-white dark:bg-card border-2 border-emerald-300 dark:border-emerald-600 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20 ring-2 ring-emerald-200/50 dark:ring-emerald-700/30'
        : 'bg-white dark:bg-card/80 border border-border/60'
    }`}>
      <div className={`text-2xl font-bold transition-transform duration-200 hover:scale-105 ${color ?? 'text-emerald-600'}`}>{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{title}{unit ? ` (${unit})` : ''}</div>
    </div>
  );
}

function LeadCapture({ type, value }: { type: 'calories' | 'bmi' | 'water' | 'ideal'; value: number }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error('يرجى إدخال بريد إلكتروني صالح'); return; }
    setSending(true);
    try {
      const body: Record<string, string | number> = { email };
      if (type === 'calories') body.calories = value;
      else if (type === 'bmi') body.bmi = value;
      else if (type === 'water') body.goal = `${value} لتر ماء`;
      else body.goal = `${value} كجم`;
      await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      await fetch('/api/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      setSent(true); toast.success('تم الإرسال بنجاح!');
    } catch { toast.error('حدث خطأ أثناء الإرسال'); } finally { setSending(false); }
  };

  if (sent) return (
    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-6 text-center animate-[scaleIn_0.3s_ease-out]">
      <div className="text-3xl mb-2">✅</div><h3 className="font-bold text-emerald-800 dark:text-emerald-300">تم الإرسال بنجاح!</h3>
      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">تحقق من بريدك الإلكتروني</p>
    </div>
  );

  const label = type === 'calories' ? 'خطة غذائية' : type === 'bmi' ? 'خطة صحية' : type === 'water' ? 'جدول شرب الماء' : 'نصائح لتحقيق الوزن المثالي';

  return (
    <div className="rounded-xl bg-gradient-to-l from-emerald-600 to-teal-500 p-6 sm:p-7 text-center text-white shadow-lg shadow-emerald-600/15 animate-[slideUp_0.4s_ease-out]">
      <h3 className="text-lg font-bold mb-2">📧 احصل على {label} مجانية</h3>
      <p className="text-emerald-100 text-sm mb-5">أدخل بريدك الإلكتروني وسنرسل لك {label} مخصصة</p>
      <div className="flex gap-2 max-w-sm mx-auto">
        <Input type="email" placeholder="بريدك الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/90 dark:bg-white/10 border-0 text-foreground dark:text-white placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white/30 h-11 rounded-lg" dir="ltr" />
        <Button onClick={send} disabled={sending} className="btn-press bg-white text-emerald-700 hover:bg-emerald-50 dark:hover:bg-white/90 font-semibold shrink-0 h-11 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">{sending ? '⏳' : 'إرسال'}</Button>
      </div>
    </div>
  );
}

// ===== Calorie Calculator =====
function CalorieCalculator() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('');
  const [result, setResult] = useState<CalorieResult | null>(null);

  const calculate = () => {
    if (!age || !gender || !weight || !height || !activity) { toast.error('يرجى ملء جميع الحقول'); return; }
    const a = Number(age), w = Number(weight), h = Number(height), af = Number(activity);
    if (a < 10 || a > 100) { toast.error('يرجى إدخال عمر صالح'); return; }
    if (w < 20 || w > 300) { toast.error('يرجى إدخال وزن صالح'); return; }
    if (h < 100 || h > 250) { toast.error('يرجى إدخال طول صالح'); return; }
    const bmr = gender === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = Math.round(bmr * af);
    setResult({ tdee, lose: Math.round(tdee * 0.8), maintain: tdee, gain: Math.round(tdee * 1.2) });
    triggerMonetag();
  };

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2.5">🔥 حاسبة السعرات الحرارية</CardTitle>
        <CardDescription>احسب احتياجك اليومي باستخدام معادلة Mifflin-St Jeor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="age" className="text-sm font-medium">العمر (سنوات)</Label><Input id="age" type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} className="h-11 focus-visible:ring-emerald-600/30 transition-all duration-200" /></div>
          <div className="space-y-2"><Label className="text-sm font-medium">الجنس</Label><Select value={gender} onValueChange={setGender}><SelectTrigger className="h-11 focus:ring-emerald-600/30 transition-all duration-200"><SelectValue placeholder="اختر الجنس" /></SelectTrigger><SelectContent><SelectItem value="male">ذكر</SelectItem><SelectItem value="female">أنثى</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="weight" className="text-sm font-medium">الوزن (كجم)</Label><Input id="weight" type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-11 focus-visible:ring-emerald-600/30 transition-all duration-200" /></div>
          <div className="space-y-2"><Label htmlFor="height" className="text-sm font-medium">الطول (سم)</Label><Input id="height" type="number" placeholder="170" value={height} onChange={(e) => setHeight(e.target.value)} className="h-11 focus-visible:ring-emerald-600/30 transition-all duration-200" /></div>
          <div className="space-y-2 sm:col-span-2"><Label className="text-sm font-medium">مستوى النشاط</Label><Select value={activity} onValueChange={setActivity}><SelectTrigger className="h-11 focus:ring-emerald-600/30 transition-all duration-200"><SelectValue placeholder="اختر مستوى نشاطك" /></SelectTrigger><SelectContent><SelectItem value="1.2">خامل</SelectItem><SelectItem value="1.375">خفيف (1-3 مرات/أسبوع)</SelectItem><SelectItem value="1.55">معتدل (3-5 مرات/أسبوع)</SelectItem><SelectItem value="1.725">نشط (6-7 مرات/أسبوع)</SelectItem><SelectItem value="1.9">نشط جدًا</SelectItem></SelectContent></Select></div>
        </div>
        <Button onClick={calculate} className="btn-press w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 text-base rounded-xl shadow-sm shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/25 transition-all duration-300">احسب احتياجي من السعرات</Button>
        {result && (
          <div className="page-transition space-y-4 pt-2">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-6">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-4 text-center">📊 نتائجك الشخصية</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <ResultCard title="لإنقاص الوزن" value={result.lose} unit="سعرة" color="text-red-600 dark:text-red-400" />
                <ResultCard title="للحفاظ" value={result.maintain} unit="سعرة" highlight />
                <ResultCard title="لزيادة الوزن" value={result.gain} unit="سعرة" color="text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-5">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">💡 ماذا تعني هذه الأرقام؟</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1.5 list-disc list-inside">
                <li><strong>إنقاص الوزن</strong>: تناول هذا العدد لتخسر 0.5 كجم أسبوعيًا</li>
                <li><strong>الحفاظ</strong>: احتياجك اليومي للثبات على وزنك</li>
                <li><strong>زيادة الوزن</strong>: لزيادة كتلتك العضلية</li>
              </ul>
            </div>
            <LeadCapture type="calories" value={result.maintain} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ===== BMI Calculator =====
function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculate = () => {
    if (!weight || !height) { toast.error('يرجى ملء جميع الحقول'); return; }
    const w = Number(weight), h = Number(height);
    if (w < 20 || w > 300 || h < 100 || h > 250) { toast.error('يرجى إدخال قيم صالحة'); return; }
    const hm = h / 100, bmi = w / (hm * hm), bmiR = Math.round(bmi * 10) / 10;
    let cat: string, col: string;
    if (bmi < 18.5) { cat = 'نقص في الوزن'; col = 'text-blue-600 dark:text-blue-400'; }
    else if (bmi < 25) { cat = 'وزن طبيعي'; col = 'text-emerald-600 dark:text-emerald-400'; }
    else if (bmi < 30) { cat = 'زيادة في الوزن'; col = 'text-amber-600 dark:text-amber-400'; }
    else { cat = 'سمنة'; col = 'text-red-600 dark:text-red-400'; }
    setResult({ bmi: bmiR, category: cat, color: col });
    triggerMonetag();
  };

  const barW = (bmi: number) => bmi < 10 ? 5 : bmi > 45 ? 95 : ((bmi - 10) / 35) * 90 + 5;

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2.5">📊 حاسبة مؤشر كتلة الجسم (BMI)</CardTitle>
        <CardDescription>احسب مؤشر كتلة جسمك لمعرفة ما إذا كان وزنك مناسبًا</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="bw" className="text-sm font-medium">الوزن (كجم)</Label><Input id="bw" type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-11 focus-visible:ring-emerald-600/30 transition-all duration-200" /></div>
          <div className="space-y-2"><Label htmlFor="bh" className="text-sm font-medium">الطول (سم)</Label><Input id="bh" type="number" placeholder="170" value={height} onChange={(e) => setHeight(e.target.value)} className="h-11 focus-visible:ring-emerald-600/30 transition-all duration-200" /></div>
        </div>
        <Button onClick={calculate} className="btn-press w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 text-base rounded-xl shadow-sm shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/25 transition-all duration-300">احسب مؤشر كتلة الجسم</Button>
        {result && (
          <div className="page-transition space-y-4 pt-2">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-6 text-center">
              <div className="text-5xl font-bold text-emerald-700 dark:text-emerald-400 mb-2 transition-transform duration-200 hover:scale-105 inline-block">{result.bmi}</div>
              <div className={`text-lg font-semibold ${result.color}`}>{result.category}</div>
              <div className="mt-6 px-4">
                <div className="relative h-3 rounded-full overflow-hidden shadow-inner">
                  <div className="absolute inset-0 flex"><div className="flex-1 bg-blue-300 dark:bg-blue-700" /><div className="flex-[1.5] bg-emerald-400 dark:bg-emerald-600" /><div className="flex-1 bg-amber-400 dark:bg-amber-600" /><div className="flex-1 bg-red-400 dark:bg-red-600" /></div>
                  <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-5 bg-foreground rounded-full shadow-lg transition-all duration-700 ease-out" style={{ right: `${barW(result.bmi)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5"><span>10</span><span>18.5</span><span>25</span><span>30</span><span>45</span></div>
              </div>
            </div>
            <div className="rounded-xl bg-muted/40 border border-border p-4">
              <h4 className="font-semibold text-foreground mb-3 text-sm">📋 الفئات</h4>
              <div className="grid gap-2.5 text-sm">
                {[['أقل من 18.5', 'نقص في الوزن', 'text-blue-600 dark:text-blue-400'], ['18.5 - 24.9', 'طبيعي ✓', 'text-emerald-600 dark:text-emerald-400'], ['25 - 29.9', 'زيادة في الوزن', 'text-amber-600 dark:text-amber-400'], ['30+', 'سمنة', 'text-red-600 dark:text-red-400']].map(([r, l, c]) => (
                  <div key={r} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors duration-150"><span className="text-muted-foreground">{r}</span><span className={`${c} font-medium`}>{l}</span></div>
                ))}
              </div>
            </div>
            <LeadCapture type="bmi" value={result.bmi} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ===== Water Calculator =====
function WaterCalculator() {
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('');
  const [result, setResult] = useState<WaterResult | null>(null);

  const calculate = () => {
    if (!weight || !activity) { toast.error('يرجى ملء جميع الحقول'); return; }
    const w = Number(weight);
    if (w < 20 || w > 300) { toast.error('يرجى إدخال وزن صالح'); return; }
    let base = w * 0.033;
    if (activity === 'moderate') base += 0.5;
    else if (activity === 'active') base += 1;
    else if (activity === 'intense') base += 1.5;
    const liters = Math.round(base * 10) / 10;
    setResult({ liters, cups: Math.ceil(liters * 4.2) });
    triggerMonetag();
  };

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2.5">💧 حاسبة الماء اليومي</CardTitle>
        <CardDescription>احسب كمية الماء التي يحتاجها جسمك يوميًا</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label className="text-sm font-medium">الوزن (كجم)</Label><Input type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-11 focus-visible:ring-emerald-600/30 transition-all duration-200" /></div>
          <div className="space-y-2"><Label className="text-sm font-medium">مستوى النشاط</Label><Select value={activity} onValueChange={setActivity}><SelectTrigger className="h-11 focus:ring-emerald-600/30 transition-all duration-200"><SelectValue placeholder="اختر" /></SelectTrigger><SelectContent><SelectItem value="low">خامل / قليل الحركة</SelectItem><SelectItem value="moderate">معتدل (تمرين خفيف)</SelectItem><SelectItem value="active">نشط (تمرين يومي)</SelectItem><SelectItem value="intense">نشط جدًا (رياضي)</SelectItem></SelectContent></Select></div>
        </div>
        <Button onClick={calculate} className="btn-press w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 text-base rounded-xl shadow-sm shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/25 transition-all duration-300">احسب كمية الماء</Button>
        {result && (
          <div className="page-transition space-y-4 pt-2">
            <div className="rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 p-6 text-center">
              <div className="text-5xl mb-3">💧</div>
              <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 transition-transform duration-200 hover:scale-105 inline-block">{result.liters} <span className="text-2xl">لتر</span></div>
              <div className="text-lg text-muted-foreground mt-2">≈ {result.cups} كوب ماء</div>
              <div className="flex justify-center gap-1.5 mt-5 flex-wrap">
                {Array.from({ length: Math.min(result.cups, 12) }).map((_, i) => (
                  <div key={i} className="w-7 h-9 rounded-lg bg-cyan-400 dark:bg-cyan-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm transition-all duration-200 hover:scale-110 hover:bg-cyan-500">{i + 1}</div>
                ))}
                {result.cups > 12 && <div className="w-7 h-9 rounded-lg bg-cyan-200 dark:bg-cyan-800 flex items-center justify-center text-[10px] font-bold text-cyan-700 dark:text-cyan-300">+{result.cups - 12}</div>}
              </div>
            </div>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-5">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 نصائح لشرب الماء</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1.5 list-disc list-inside">
                <li>اشرب كوبًا عند الاستيقاظ مباشرة</li>
                <li>احمل زجاجة ماء معك دائمًا</li>
                <li>اشرب قبل كل وجبة بنصف ساعة</li>
                <li>أضف ليمون أو نعناع للنكهة</li>
              </ul>
            </div>
            <LeadCapture type="water" value={result.liters} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ===== Ideal Weight Calculator =====
function IdealWeightCalculator() {
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState<IdealWeightResult | null>(null);

  const calculate = () => {
    if (!gender || !height || !age) { toast.error('يرجى ملء جميع الحقول'); return; }
    const h = Number(height), a = Number(age);
    if (h < 100 || h > 250) { toast.error('يرجى إدخال طول صالح'); return; }
    let base: number;
    if (gender === 'male') base = 50 + 2.3 * ((h / 2.54) - 60);
    else base = 45.5 + 2.3 * ((h / 2.54) - 60);
    if (a > 40) base += (a - 40) * 0.2;
    const ideal = Math.round(base);
    const min = Math.round(base * 0.9);
    const max = Math.round(base * 1.1);
    setResult({ min, max, ideal });
    triggerMonetag();
  };

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2.5">⚖️ حاسبة الوزن المثالي</CardTitle>
        <CardDescription>اكتشف الوزن المثالي لطولك وجنسك وعمرك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2"><Label className="text-sm font-medium">الجنس</Label><Select value={gender} onValueChange={setGender}><SelectTrigger className="h-11 focus:ring-emerald-600/30 transition-all duration-200"><SelectValue placeholder="اختر" /></SelectTrigger><SelectContent><SelectItem value="male">ذكر</SelectItem><SelectItem value="female">أنثى</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label className="text-sm font-medium">الطول (سم)</Label><Input type="number" placeholder="170" value={height} onChange={(e) => setHeight(e.target.value)} className="h-11 focus-visible:ring-emerald-600/30 transition-all duration-200" /></div>
          <div className="space-y-2"><Label className="text-sm font-medium">العمر</Label><Input type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} className="h-11 focus-visible:ring-emerald-600/30 transition-all duration-200" /></div>
        </div>
        <Button onClick={calculate} className="btn-press w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 text-base rounded-xl shadow-sm shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/25 transition-all duration-300">احسب الوزن المثالي</Button>
        {result && (
          <div className="page-transition space-y-4 pt-2">
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-6 text-center">
              <div className="text-5xl mb-3">⚖️</div>
              <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 transition-transform duration-200 hover:scale-105 inline-block">{result.ideal} <span className="text-xl">كجم</span></div>
              <div className="text-muted-foreground mt-2">الوزن المثالي التقريبي</div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white dark:bg-card p-3 border border-amber-100 dark:border-amber-800 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"><div className="text-lg font-bold text-amber-500 dark:text-amber-400">{result.min}</div><div className="text-xs text-muted-foreground">الحد الأدنى</div></div>
                <div className="rounded-xl bg-white dark:bg-card p-3 border-2 border-amber-300 dark:border-amber-600 shadow-md ring-2 ring-amber-200/50 dark:ring-amber-700/30"><div className="text-lg font-bold text-amber-600 dark:text-amber-400">{result.ideal}</div><div className="text-xs text-muted-foreground">المثالي</div></div>
                <div className="rounded-xl bg-white dark:bg-card p-3 border border-amber-100 dark:border-amber-800 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"><div className="text-lg font-bold text-amber-500 dark:text-amber-400">{result.max}</div><div className="text-xs text-muted-foreground">الحد الأقصى</div></div>
              </div>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-5">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">💡 ملاحظة</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                الوزن المثالي تقديري مبني على معادلة Devine. العوامل مثل الكتلة العضلية وبنية الجسم تؤثر على الوزن الصحي الفعلي. استشر طبيبك للحصول على تقييم دقيق.
              </p>
            </div>
            <LeadCapture type="ideal" value={result.ideal} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ===== Daily Calorie Tracker =====
function DailyTracker() {
  const [entries, setEntries] = useState<DayEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try { const saved = localStorage.getItem('calorie_tracker'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  const [todayCal, setTodayCal] = useState('');
  const [todayGoal, setTodayGoal] = useState(() => {
    if (typeof window === 'undefined') return '';
    try { return localStorage.getItem('calorie_goal') || ''; } catch { return ''; }
  });

  const saveEntries = useCallback((newEntries: DayEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('calorie_tracker', JSON.stringify(newEntries));
  }, []);

  const logToday = () => {
    const cal = Number(todayCal);
    const goal = Number(todayGoal);
    if (!cal) { toast.error('أدخل السعرات'); return; }
    const today = new Date().toISOString().split('T')[0];
    const updated = [...entries.filter((e) => e.date !== today), { date: today, calories: cal, goal: goal || cal }];
    saveEntries(updated);
    if (todayGoal) localStorage.setItem('calorie_goal', todayGoal);
    setTodayCal('');
    toast.success('تم تسجيل السعرات ✅');
  };

  const chartData = entries.slice(-7).map((e) => ({
    name: new Date(e.date).toLocaleDateString('ar-SA', { weekday: 'short' }),
    سعرات: e.calories,
    الهدف: e.goal,
  }));

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2.5">📈 متتبع السعرات اليومي</CardTitle>
        <CardDescription>تابع استهلاكك اليومي من السعرات (يُحفظ محليًا)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">السعرات المتناولة اليوم</Label>
            <Input type="number" placeholder="1800" value={todayCal} onChange={(e) => setTodayCal(e.target.value)} className="h-11 focus-visible:ring-emerald-600/30 transition-all duration-200" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">الهدف اليومي</Label>
            <Input type="number" placeholder="2000" value={todayGoal} onChange={(e) => setTodayGoal(e.target.value)} className="h-11 focus-visible:ring-emerald-600/30 transition-all duration-200" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={logToday} className="btn-press flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/25 transition-all duration-300 h-11">📝 سجّل اليوم</Button>
          <Button variant="outline" onClick={() => { if (confirm('حذف كل البيانات؟')) { saveEntries([]); localStorage.removeItem('calorie_goal'); toast.success('تم الحذف'); } }} className="btn-press rounded-xl border-border/60 hover:border-red-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-11 w-11 p-0">🗑️</Button>
        </div>

        {chartData.length > 0 && (
          <>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-5">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3 text-sm">📊 آخر 7 أيام</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <XAxis type="number" domain={[0, 'auto']} />
                    <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif', borderRadius: '12px', border: '1px solid oklch(0.92 0.01 150)' }} />
                    <Bar dataKey="سعرات" fill="#059669" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="الهدف" fill="#d1fae5" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend */}
            {entries.length >= 3 && (
              <div className="rounded-xl bg-muted/30 border border-border p-5">
                <h4 className="font-semibold text-foreground mb-3 text-sm">📈 اتجاه السعرات</h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 'auto']} />
                      <Tooltip contentStyle={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif', borderRadius: '12px', border: '1px solid oklch(0.92 0.01 150)' }} />
                      <Line type="monotone" dataKey="سعرات" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669', r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="الهدف" stroke="#d1fae5" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}

        {entries.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <div className="text-5xl mb-3 opacity-50">📝</div>
            <p className="text-sm">ابدأ بتسجيل سعراتك اليومية لتتبع تقدمك</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ===== Monetag is handled via @/lib/monetag.ts =====

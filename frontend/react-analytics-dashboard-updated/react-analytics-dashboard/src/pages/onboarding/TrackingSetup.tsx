import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getOnboardingStatus, 
  generateTrackingId, 
  getTrackingCodes 
} from '../../services/onboarding';
import { TRACK_ENDPOINT_URL } from '../../services/api';
import { cn } from '../../lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Code,
  FileCode,
  Loader2,
} from 'lucide-react';

type CodeTab = 'html' | 'javascript' | 'react' | 'nextjs';

const tabs: { id: CodeTab; label: string; icon: React.ReactNode }[] = [
  { id: 'html', label: 'HTML', icon: <Code className="w-4 h-4" /> },
  { id: 'javascript', label: 'JavaScript', icon: <FileCode className="w-4 h-4" /> },
  { id: 'react', label: 'React', icon: <FileCode className="w-4 h-4" /> },
  { id: 'nextjs', label: 'Next.js', icon: <FileCode className="w-4 h-4" /> },
];

export const TrackingSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CodeTab>('html');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadTrackingId();
  }, []);

  const loadTrackingId = async () => {
    try {
      // أولاً نحاول الحصول على الحالة الحالية
      const status = await getOnboardingStatus();
      
      if (status.tracking_id) {
        setTrackingId(status.tracking_id);
      } else {
        // إنشاء tracking_id جديد
        const result = await generateTrackingId();
        setTrackingId(result.tracking_id);
      }
    } catch (err) {
      console.error('Failed to load tracking ID:', err);
    } finally {
      setLoading(false);
    }
  };

  const apiUrl = TRACK_ENDPOINT_URL.replace('/track', '');
  const codes = trackingId ? getTrackingCodes(trackingId, apiUrl) : null;

  const getCurrentCode = () => {
    if (!codes) return '';
    return codes[activeTab];
  };

  const handleCopy = async () => {
    const code = getCurrentCode();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    navigate('/onboarding/verify');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Analytics Dashboard</h1>
          <button
            onClick={() => navigate('/onboarding/website-type')}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              <Check className="w-4 h-4" />
            </div>
            <div className="h-1 flex-1 bg-primary rounded" />
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div className="h-1 flex-1 bg-muted rounded">
              <div className="h-full w-1/2 bg-primary rounded" />
            </div>
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
              3
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">أضف كود التتبع إلى موقعك</h2>
            <p className="text-lg text-muted-foreground">
              انسخ الكود أدناه وألصقه في موقعك لبدء جمع البيانات
            </p>
          </div>

          {/* Tracking ID Display */}
          <div className="mb-8 p-4 rounded-xl border bg-card text-center">
            <span className="text-sm text-muted-foreground">معرف التتبع الخاص بك:</span>
            <div className="text-xl font-mono font-bold text-primary mt-1">
              {trackingId}
            </div>
          </div>

          {/* Code Tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Block */}
          <div className="relative mb-8">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={handleCopy}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all",
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    نسخ
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 pt-12 rounded-xl bg-zinc-950 text-zinc-100 overflow-x-auto text-sm leading-relaxed">
              <code>{getCurrentCode()}</code>
            </pre>
          </div>

          {/* Instructions */}
          <div className="mb-8 p-6 rounded-xl border bg-card">
            <h3 className="font-semibold mb-4">خطوات التثبيت:</h3>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                  1
                </span>
                <span>انسخ الكود أعلاه بالضغط على زر "نسخ"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                  2
                </span>
                <span>
                  {activeTab === 'html' 
                    ? 'ألصق الكود داخل وسم <head> في صفحتك قبل أي scripts أخرى'
                    : activeTab === 'nextjs'
                    ? 'أضف الكود في ملف _app.tsx أو layout.tsx'
                    : 'أضف الكود في نقطة الدخول الرئيسية لتطبيقك'
                  }
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                  3
                </span>
                <span>احفظ الملف وانشر التغييرات إلى موقعك</span>
              </li>
            </ol>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              أكمل لاحقاً
            </button>
            <button
              onClick={handleContinue}
              className="px-8 py-3 rounded-lg font-medium text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              التحقق من التثبيت
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackingSetupPage;

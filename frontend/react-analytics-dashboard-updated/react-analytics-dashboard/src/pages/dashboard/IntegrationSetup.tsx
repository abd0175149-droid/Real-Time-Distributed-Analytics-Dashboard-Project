import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../components/AuthContext';
import {
  Code,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Terminal,
  Globe,
  Zap,
  Shield,
  Settings,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Play,
  Key,
  FileCode
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SetupStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function IntegrationSetup() {
  const { me, refreshMe } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

  // Get tracking ID from user data
  const trackingId = me?.tracking_id || 'لم يتم إنشاء معرف بعد';
  const hasTrackingId = !!me?.tracking_id;
  const isOnboarded = me?.is_onboarded;
  const websiteUrl = me?.website_url || 'https://yourwebsite.com';

  // Setup steps based on user state
  const setupSteps: SetupStep[] = [
    { id: 1, title: 'إنشاء حساب', description: 'تم إنشاء حسابك بنجاح', completed: true },
    { id: 2, title: 'إنشاء معرف التتبع', description: hasTrackingId ? 'تم إنشاء المعرف' : 'قم بإضافة موقعك', completed: hasTrackingId },
    { id: 3, title: 'تثبيت كود التتبع', description: 'أضف الكود لموقعك', completed: isOnboarded || false },
    { id: 4, title: 'التحقق من التثبيت', description: 'تأكد من عمل الكود', completed: verificationStatus === 'success' },
  ];

  // API endpoint - يجب أن يكون هذا هو عنوان الخادم الخاص بك
  const apiEndpoint = 'http://localhost:8000/api/track';

  // الكود الأساسي للتتبع (HTML)
  const basicTrackingCode = `<!-- DataFlow Analytics Tracker -->
<script 
    src="https://your-domain.com/tracker/index.js"
    data-endpoint="${apiEndpoint}"
    data-tracking-id="${trackingId}"
    data-batch-size="10"
    data-interval="5000"
    data-debug="false">
</script>
<!-- End DataFlow Analytics -->`;

  // كود للتشغيل المحلي (للاختبار)
  const localTrackingCode = `<!-- DataFlow Analytics Tracker (Local Development) -->
<script 
    src="../tracker/index.js"
    data-endpoint="http://localhost:8000/api/track"
    data-tracking-id="${trackingId}"
    data-batch-size="10"
    data-interval="5000"
    data-debug="true">
</script>
<!-- End DataFlow Analytics -->`;

  // كود React/Next.js
  const reactIntegrationCode = `// في ملف _app.tsx أو layout.tsx أو index.html
// أضف هذا السكربت في <head> أو قبل </body>

// الطريقة 1: إضافة مباشرة في HTML
<Script 
  src="/tracker/index.js"
  data-endpoint="${apiEndpoint}"
  data-tracking-id="${trackingId}"
  data-debug={process.env.NODE_ENV === 'development'}
/>

// الطريقة 2: تحميل ديناميكي
useEffect(() => {
  const script = document.createElement('script');
  script.src = '/tracker/index.js';
  script.setAttribute('data-endpoint', '${apiEndpoint}');
  script.setAttribute('data-tracking-id', '${trackingId}');
  script.setAttribute('data-debug', 'false');
  document.head.appendChild(script);
}, []);`;

  // كود التجارة الإلكترونية
  const ecommerceTrackingCode = `// تتبع عرض المنتج
window.analytics.trackProductView(
  'product-id-123',      // معرف المنتج
  'اسم المنتج',          // اسم المنتج
  99.99,                 // السعر
  'الفئة'                // الفئة
);

// تتبع الإضافة للسلة
window.analytics.trackCartAdd(
  'product-id-123',
  'اسم المنتج',
  99.99,
  1                      // الكمية
);

// تتبع إتمام الشراء
window.analytics.trackPurchase(
  'order-123',           // معرف الطلب
  [                      // المنتجات
    { id: 'prod-1', name: 'منتج 1', price: 50, quantity: 2 },
    { id: 'prod-2', name: 'منتج 2', price: 30, quantity: 1 }
  ],
  130,                   // المجموع
  'SAR'                  // العملة
);

// تتبع خطوات الشراء
window.analytics.trackCheckoutStep(1, 'عرض السلة');
window.analytics.trackCheckoutStep(2, 'معلومات الشحن');
window.analytics.trackCheckoutStep(3, 'الدفع');`;

  // كود الأحداث المخصصة
  const customEventsCode = `// تتبع أحداث مخصصة
window.analytics.track('user_signup', {
  source: 'landing_page',
  plan: 'free'
});

window.analytics.track('search', {
  query: 'كلمة البحث',
  results: 10
});

window.analytics.track('share', {
  platform: 'twitter',
  content_id: 'article-123'
});`;

  const copyToClipboard = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationStatus('pending');
    
    try {
      // محاولة إرسال حدث اختباري
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'verification_test',
          tracking_id: trackingId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setVerificationStatus('success');
        // تحديث بيانات المستخدم
        await refreshMe();
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            خطوات الإعداد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {setupSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2",
                    step.completed ? "bg-green-500 border-green-500 text-white" : "border-muted-foreground"
                  )}>
                    {step.completed ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                </div>
                {index < setupSteps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-1 mx-4",
                    step.completed ? "bg-green-500" : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tracking ID Card - الأهم */}
      <Card className="border-2 border-primary">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            معرّف التتبع الخاص بك
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {hasTrackingId ? (
            <>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <code className="text-xl font-mono font-bold text-primary flex-1">{trackingId}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(trackingId, 'tracking-id')}
                >
                  {copiedCode === 'tracking-id' ? (
                    <>
                      <Check className="h-4 w-4 text-green-500 ml-1" />
                      تم النسخ
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 ml-1" />
                      نسخ
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                استخدم هذا المعرّف في جميع أكواد التتبع. يجب أن يكون هذا المعرف موجوداً في كل صفحة تريد تتبعها.
              </p>
            </>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">لم يتم إنشاء معرف التتبع بعد</span>
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-2">
                يتم إنشاء معرف التتبع تلقائياً عند إكمال عملية الإعداد الأولي.
              </p>
            </div>
          )}

          {/* معلومات الموقع */}
          {me?.website_url && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">الموقع المرتبط:</span>
                <a href={me.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {me.website_url}
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic HTML Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            الطريقة 1: كود HTML الأساسي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            أضف هذا الكود قبل علامة <code className="bg-muted px-1 rounded">&lt;/body&gt;</code> في موقعك
          </p>
          <div className="relative">
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm" dir="ltr">
              <code>{basicTrackingCode}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 left-2"
              onClick={() => copyToClipboard(basicTrackingCode, 'basic')}
            >
              {copiedCode === 'basic' ? (
                <>
                  <Check className="h-4 w-4 text-green-500 ml-1" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 ml-1" />
                  نسخ
                </>
              )}
            </Button>
          </div>

          {/* Local Development Code */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              للتطوير المحلي (localhost)
            </p>
            <div className="relative">
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm" dir="ltr">
                <code>{localTrackingCode}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 left-2"
                onClick={() => copyToClipboard(localTrackingCode, 'local')}
              >
                {copiedCode === 'local' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* React/Next.js Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            الطريقة 2: React / Next.js
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            للمشاريع التي تستخدم React أو Next.js أو أي إطار عمل مشابه
          </p>
          <div className="relative">
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm" dir="ltr">
              <code>{reactIntegrationCode}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 left-2"
              onClick={() => copyToClipboard(reactIntegrationCode, 'react')}
            >
              {copiedCode === 'react' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* E-commerce Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            تتبع التجارة الإلكترونية (اختياري)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            استخدم هذه الدوال لتتبع أحداث التجارة الإلكترونية (بعد تحميل كود التتبع الأساسي)
          </p>
          <div className="relative">
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm" dir="ltr">
              <code>{ecommerceTrackingCode}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 left-2"
              onClick={() => copyToClipboard(ecommerceTrackingCode, 'ecommerce')}
            >
              {copiedCode === 'ecommerce' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            الأحداث المخصصة (اختياري)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            تتبع أي حدث مخصص تريده
          </p>
          <div className="relative">
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm" dir="ltr">
              <code>{customEventsCode}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 left-2"
              onClick={() => copyToClipboard(customEventsCode, 'custom')}
            >
              {copiedCode === 'custom' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            التحقق من التثبيت
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            بعد إضافة الكود لموقعك، اضغط على الزر للتحقق من التثبيت
          </p>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleVerify}
              disabled={isVerifying || !hasTrackingId}
              className="flex items-center gap-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  التحقق من التثبيت
                </>
              )}
            </Button>

            {verificationStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span>تم التثبيت بنجاح!</span>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <span>تأكد من تشغيل الخادم وإضافة الكود</span>
              </div>
            )}
          </div>

          {verificationStatus === 'success' && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">
                تهانينا! التثبيت مكتمل
              </h4>
              <p className="text-sm text-green-600 dark:text-green-500">
                سيبدأ جمع البيانات خلال دقائق. يمكنك الآن الذهاب إلى لوحة التحكم لرؤية الإحصائيات.
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <a href="/dashboard/overview">
                  الذهاب للوحة التحكم
                  <ChevronRight className="h-4 w-4 mr-1" />
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* البيانات التي يتم جمعها */}
      <Card>
        <CardHeader>
          <CardTitle>البيانات التي يتم جمعها تلقائياً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">معلومات الجهاز</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• نوع الجهاز (Desktop/Mobile/Tablet)</li>
                <li>• نظام التشغيل</li>
                <li>• المتصفح</li>
                <li>• دقة الشاشة</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">معلومات الجلسة</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• مدة الجلسة</li>
                <li>• الصفحات المزارة</li>
                <li>• مصدر الزيارة (Referrer)</li>
                <li>• الموقع الجغرافي (الدولة/المدينة)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">التفاعلات</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• النقرات على الأزرار والروابط</li>
                <li>• عمق التمرير</li>
                <li>• إرسال النماذج</li>
                <li>• أحداث الفيديو</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">الأداء</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• وقت تحميل الصفحة</li>
                <li>• سرعة الاتصال</li>
                <li>• معلومات الشبكة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Links */}
      <Card>
        <CardHeader>
          <CardTitle>هل تحتاج مساعدة؟</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/dashboard/integration/guide" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors">
              <Code className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">دليل التكامل</div>
                <div className="text-sm text-muted-foreground">شرح مفصل</div>
              </div>
              <ChevronRight className="h-4 w-4 mr-auto" />
            </a>
            <a href="#" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors">
              <Terminal className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">API Documentation</div>
                <div className="text-sm text-muted-foreground">للمطورين</div>
              </div>
              <ExternalLink className="h-4 w-4 mr-auto" />
            </a>
            <a href="#" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">صفحة الاختبار</div>
                <div className="text-sm text-muted-foreground">جرب التتبع</div>
              </div>
              <ExternalLink className="h-4 w-4 mr-auto" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

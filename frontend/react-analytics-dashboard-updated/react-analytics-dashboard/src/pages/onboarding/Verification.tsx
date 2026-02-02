import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  verifyTracking, 
  completeOnboarding,
  skipOnboarding,
} from '../../services/onboarding';
import { useAuth } from '../../components/AuthContext';
import { cn } from '../../lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Loader2,
  RefreshCw,
  PartyPopper,
  AlertCircle,
} from 'lucide-react';

type VerificationStatus = 'idle' | 'checking' | 'success' | 'failed' | 'development';

export const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshMe } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [eventsCount, setEventsCount] = useState(0);
  const [message, setMessage] = useState('');
  const [completing, setCompleting] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  const handleVerify = async () => {
    setStatus('checking');
    setMessage('');
    setIsDevelopment(false);

    try {
      const result = await verifyTracking();
      setEventsCount(result.events_count);
      setMessage(result.message);
      
      // التحقق من بيئة التطوير
      if ((result as any).is_development) {
        setIsDevelopment(true);
        setStatus('development');
      } else if (result.verified) {
        setStatus('success');
      } else {
        setStatus('failed');
      }
    } catch (err: any) {
      setStatus('failed');
      setMessage(err.response?.data?.message || 'حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await completeOnboarding();
      await refreshMe(); // تحديث بيانات المستخدم
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setCompleting(false);
    }
  };

  const handleSkip = async () => {
    setCompleting(true);
    try {
      await skipOnboarding();
      await refreshMe();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to skip onboarding:', err);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Analytics Dashboard</h1>
          <button
            onClick={() => navigate('/onboarding/tracking')}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              <Check className="w-4 h-4" />
            </div>
            <div className="h-1 flex-1 bg-primary rounded" />
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              <Check className="w-4 h-4" />
            </div>
            <div className="h-1 flex-1 bg-primary rounded" />
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              3
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">التحقق من التثبيت</h2>
            <p className="text-lg text-muted-foreground">
              دعنا نتأكد من أن كود التتبع يعمل بشكل صحيح
            </p>
          </div>

          {/* Verification Card */}
          <div className="p-8 rounded-xl border bg-card text-center mb-8">
            {status === 'idle' && (
              <>
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
                  <RefreshCw className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">جاهز للتحقق</h3>
                <p className="text-muted-foreground mb-6">
                  بعد إضافة كود التتبع إلى موقعك، اضغط على الزر أدناه للتحقق
                </p>
                <button
                  onClick={handleVerify}
                  className="px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  التحقق الآن
                </button>
              </>
            )}

            {status === 'checking' && (
              <>
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">جاري التحقق...</h3>
                <p className="text-muted-foreground">
                  نبحث عن أحداث من موقعك
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 rounded-full bg-green-500/10 mx-auto mb-6 flex items-center justify-center">
                  <PartyPopper className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-600">تم التحقق بنجاح!</h3>
                <p className="text-muted-foreground mb-2">{message}</p>
                {eventsCount > 0 && (
                  <p className="text-sm text-green-600 mb-6">
                    استلمنا {eventsCount} حدث من موقعك
                  </p>
                )}
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="px-8 py-3 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 mx-auto"
                >
                  {completing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      الذهاب للوحة التحكم
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </>
            )}

            {status === 'development' && (
              <>
                <div className="w-20 h-20 rounded-full bg-blue-500/10 mx-auto mb-6 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">بيئة تطوير</h3>
                <p className="text-muted-foreground mb-4">{message}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  خدمة التحليلات (ClickHouse) غير متصلة حالياً. يمكنك تخطي هذه الخطوة والمتابعة أو إعداد ClickHouse للتحقق الفعلي.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleSkip}
                    disabled={completing}
                    className="px-6 py-3 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all flex items-center gap-2 justify-center"
                  >
                    {completing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        تخطي والمتابعة
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleVerify}
                    className="px-6 py-3 rounded-lg font-medium border hover:bg-muted transition-all flex items-center gap-2 justify-center"
                  >
                    <RefreshCw className="w-4 h-4" />
                    إعادة المحاولة
                  </button>
                </div>
              </>
            )}

            {status === 'failed' && (
              <>
                <div className="w-20 h-20 rounded-full bg-amber-500/10 mx-auto mb-6 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-amber-600">لم نستلم أي أحداث بعد</h3>
                <p className="text-muted-foreground mb-6">{message}</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleVerify}
                    className="px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2 justify-center"
                  >
                    <RefreshCw className="w-4 h-4" />
                    إعادة التحقق
                  </button>
                  <button
                    onClick={() => navigate('/onboarding/tracking')}
                    className="px-6 py-3 rounded-lg font-medium border hover:bg-muted transition-all"
                  >
                    مراجعة التعليمات
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Troubleshooting Tips */}
          {(status === 'failed' || status === 'idle') && (
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-muted-foreground" />
                نصائح لحل المشاكل
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  تأكد من نسخ الكود بالكامل دون تعديل
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  تأكد من أن الكود موجود داخل وسم &lt;head&gt;
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  قم بزيارة موقعك في نافذة جديدة بعد إضافة الكود
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  تأكد من أن موقعك يمكنه الوصول إلى الإنترنت
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  امسح ذاكرة التخزين المؤقت للمتصفح وأعد المحاولة
                </li>
              </ul>
            </div>
          )}

          {/* Skip Option - لا يظهر في حالة النجاح أو بيئة التطوير (لأن لديها زر تخطي خاص) */}
          {status !== 'success' && status !== 'development' && (
            <div className="mt-8 text-center">
              <button
                onClick={handleSkip}
                disabled={completing}
                className="text-sm text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 mx-auto"
              >
                {completing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    تخطي هذه الخطوة والذهاب للوحة التحكم
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerificationPage;

import { api } from './api';

// أنواع المواقع المدعومة
export type WebsiteType = 'ecommerce' | 'blog' | 'saas' | 'portfolio' | 'news' | 'other';

// حالة الـ onboarding
export interface OnboardingStatus {
  is_onboarded: boolean;
  website_type: WebsiteType | null;
  tracking_id: string | null;
  website_url: string | null;
  steps: {
    website_type: boolean;
    tracking_id: boolean;
    completed: boolean;
  };
}

// استجابة حفظ نوع الموقع
export interface SaveWebsiteTypeResponse {
  message: string;
  website_type: WebsiteType;
  tracking_id: string;
}

// استجابة إنشاء tracking_id
export interface GenerateTrackingResponse {
  tracking_id: string;
  message: string;
}

// استجابة التحقق من التتبع
export interface VerifyTrackingResponse {
  verified: boolean;
  events_count: number;
  message: string;
}

// استجابة إكمال الـ onboarding
export interface CompleteOnboardingResponse {
  message: string;
  is_onboarded: boolean;
}

// استجابة التخطي
export interface SkipOnboardingResponse {
  message: string;
  is_onboarded: boolean;
  tracking_id: string;
}

/**
 * الحصول على حالة الـ onboarding للمستخدم الحالي
 */
export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const response = await api.get<OnboardingStatus>('/onboarding/status');
  return response.data;
}

/**
 * حفظ نوع الموقع
 */
export async function saveWebsiteType(
  websiteType: WebsiteType,
  websiteUrl?: string
): Promise<SaveWebsiteTypeResponse> {
  const response = await api.post<SaveWebsiteTypeResponse>('/onboarding/website-type', {
    website_type: websiteType,
    website_url: websiteUrl,
  });
  return response.data;
}

/**
 * إنشاء tracking_id جديد
 */
export async function generateTrackingId(): Promise<GenerateTrackingResponse> {
  const response = await api.post<GenerateTrackingResponse>('/onboarding/generate-tracking');
  return response.data;
}

/**
 * إكمال عملية الـ onboarding
 */
export async function completeOnboarding(): Promise<CompleteOnboardingResponse> {
  const response = await api.post<CompleteOnboardingResponse>('/onboarding/complete');
  return response.data;
}

/**
 * التحقق من استلام events من الموقع
 */
export async function verifyTracking(): Promise<VerifyTrackingResponse> {
  const response = await api.post<VerifyTrackingResponse>('/onboarding/verify');
  return response.data;
}

/**
 * تخطي عملية الـ onboarding
 */
export async function skipOnboarding(): Promise<SkipOnboardingResponse> {
  const response = await api.post<SkipOnboardingResponse>('/onboarding/skip');
  return response.data;
}

/**
 * وصف أنواع المواقع باللغة العربية
 */
export const websiteTypeLabels: Record<WebsiteType, { label: string; description: string; icon: string }> = {
  ecommerce: {
    label: 'متجر إلكتروني',
    description: 'بيع المنتجات أو الخدمات عبر الإنترنت',
    icon: '🛒',
  },
  blog: {
    label: 'مدونة',
    description: 'نشر المقالات والمحتوى النصي',
    icon: '📝',
  },
  saas: {
    label: 'SaaS / تطبيق ويب',
    description: 'تطبيق برمجي كخدمة',
    icon: '💻',
  },
  portfolio: {
    label: 'معرض أعمال',
    description: 'عرض المشاريع والأعمال السابقة',
    icon: '🎨',
  },
  news: {
    label: 'موقع إخباري',
    description: 'نشر الأخبار والتقارير',
    icon: '📰',
  },
  other: {
    label: 'أخرى',
    description: 'نوع موقع آخر',
    icon: '🌐',
  },
};

/**
 * الحصول على أكواد التتبع الحقيقية
 * هذه الأكواد تستخدم tracker/index.js الموجود في المشروع
 */
export function getTrackingCodes(trackingId: string, apiEndpoint: string = 'http://localhost:8000/api/track') {
  return {
    // كود HTML الأساسي للإضافة قبل </body>
    html: `<!-- DataFlow Analytics Tracker -->
<script 
    src="https://your-domain.com/tracker/index.js"
    data-endpoint="${apiEndpoint}"
    data-tracking-id="${trackingId}"
    data-batch-size="10"
    data-interval="5000"
    data-debug="false">
</script>
<!-- End DataFlow Analytics -->`,

    // كود للتطوير المحلي
    local: `<!-- DataFlow Analytics Tracker (Local Development) -->
<script 
    src="../tracker/index.js"
    data-endpoint="http://localhost:8000/api/track"
    data-tracking-id="${trackingId}"
    data-batch-size="10"
    data-interval="5000"
    data-debug="true">
</script>
<!-- End DataFlow Analytics -->`,

    // كود React/Next.js
    react: `// في ملف _app.tsx أو layout.tsx أو index.html
// أضف هذا السكربت في <head> أو قبل </body>

// الطريقة 1: إضافة مباشرة في HTML
<Script 
  src="/tracker/index.js"
  data-endpoint="${apiEndpoint}"
  data-tracking-id="${trackingId}"
  data-debug={process.env.NODE_ENV === 'development'}
/>

// الطريقة 2: تحميل ديناميكي في useEffect
useEffect(() => {
  const script = document.createElement('script');
  script.src = '/tracker/index.js';
  script.setAttribute('data-endpoint', '${apiEndpoint}');
  script.setAttribute('data-tracking-id', '${trackingId}');
  script.setAttribute('data-debug', 'false');
  document.head.appendChild(script);
}, []);`,

    // كود التجارة الإلكترونية
    ecommerce: `// تتبع عرض المنتج
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
  [{ id: 'prod-1', name: 'منتج', price: 50, quantity: 1 }],
  50,                    // المجموع
  'SAR'                  // العملة
);`,

    // الأحداث المخصصة
    custom: `// تتبع أحداث مخصصة
window.analytics.track('user_signup', {
  source: 'landing_page',
  plan: 'free'
});

window.analytics.track('search', {
  query: 'كلمة البحث',
  results: 10
});`,
  };
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferencesStore } from '../../store';
import { saveWebsiteType, WebsiteType as WebsiteTypeEnum } from '../../services/onboarding';
import { cn } from '../../lib/utils';
import {
  ShoppingCart,
  BookOpen,
  Layers,
  Briefcase,
  Newspaper,
  Settings,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface WebsiteOption {
  type: WebsiteTypeEnum;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ReactNode;
  features: string[];
  featuresAr: string[];
}

const websiteOptions: WebsiteOption[] = [
  {
    type: 'ecommerce',
    title: 'E-commerce',
    titleAr: 'متجر إلكتروني',
    description: 'Online stores and marketplaces',
    descriptionAr: 'بيع المنتجات والخدمات عبر الإنترنت',
    icon: <ShoppingCart className="w-8 h-8" />,
    features: ['Revenue tracking', 'Product analytics', 'Conversion funnels', 'Customer insights'],
    featuresAr: ['تتبع الإيرادات', 'تحليلات المنتجات', 'قمع التحويل', 'رؤى العملاء'],
  },
  {
    type: 'blog',
    title: 'Blog / Content',
    titleAr: 'مدونة / محتوى',
    description: 'Blogs, magazines, and content sites',
    descriptionAr: 'المدونات والمجلات ومواقع المحتوى',
    icon: <BookOpen className="w-8 h-8" />,
    features: ['Article performance', 'Read time tracking', 'Scroll depth', 'Engagement metrics'],
    featuresAr: ['أداء المقالات', 'تتبع وقت القراءة', 'عمق التمرير', 'مقاييس التفاعل'],
  },
  {
    type: 'saas',
    title: 'SaaS Application',
    titleAr: 'تطبيق SaaS',
    description: 'Software as a Service products',
    descriptionAr: 'تطبيقات البرمجيات كخدمة',
    icon: <Layers className="w-8 h-8" />,
    features: ['User signups', 'Feature adoption', 'Retention analysis', 'Churn tracking'],
    featuresAr: ['تسجيلات المستخدمين', 'تبني الميزات', 'تحليل الاحتفاظ', 'تتبع التخلي'],
  },
  {
    type: 'portfolio',
    title: 'Portfolio / Business',
    titleAr: 'معرض أعمال / شركة',
    description: 'Personal or company websites',
    descriptionAr: 'المواقع الشخصية ومواقع الشركات',
    icon: <Briefcase className="w-8 h-8" />,
    features: ['Page views', 'Contact tracking', 'Project views', 'Download tracking'],
    featuresAr: ['مشاهدات الصفحات', 'تتبع التواصل', 'مشاهدات المشاريع', 'تتبع التحميلات'],
  },
  {
    type: 'news',
    title: 'News / Media',
    titleAr: 'أخبار / إعلام',
    description: 'News sites and media portals',
    descriptionAr: 'المواقع الإخبارية وبوابات الإعلام',
    icon: <Newspaper className="w-8 h-8" />,
    features: ['Trending content', 'Breaking news', 'Social shares', 'Reader engagement'],
    featuresAr: ['المحتوى الرائج', 'الأخبار العاجلة', 'المشاركات', 'تفاعل القراء'],
  },
  {
    type: 'other',
    title: 'Other',
    titleAr: 'أخرى',
    description: 'Choose your own analytics',
    descriptionAr: 'اختر تحليلاتك الخاصة',
    icon: <Settings className="w-8 h-8" />,
    features: ['Full customization', 'All metrics available', 'Build your own dashboard'],
    featuresAr: ['تخصيص كامل', 'جميع المقاييس متاحة', 'ابنِ لوحتك الخاصة'],
  },
];

export const WebsiteTypePage: React.FC = () => {
  const navigate = useNavigate();
  const { setWebsiteType: setStoreWebsiteType } = usePreferencesStore();
  const [selected, setSelected] = useState<WebsiteTypeEnum | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (type: WebsiteTypeEnum) => {
    setSelected(type);
    setError(null);
  };

  const handleContinue = async () => {
    if (!selected) return;

    setLoading(true);
    setError(null);

    try {
      // حفظ في Backend
      await saveWebsiteType(selected, websiteUrl || undefined);
      
      // حفظ محلياً للتخصيص السريع
      setStoreWebsiteType(selected as any);
      
      // الانتقال للخطوة التالية
      navigate('/onboarding/tracking');
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Analytics Dashboard</h1>
          <button
            onClick={() => navigate('/onboarding/welcome')}
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
              1
            </div>
            <div className="h-1 flex-1 bg-muted rounded">
              <div className="h-full w-1/3 bg-primary rounded" />
            </div>
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div className="h-1 flex-1 bg-muted rounded" />
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
              3
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">ما نوع موقعك؟</h2>
            <p className="text-lg text-muted-foreground">
              سنخصص لوحة التحكم بالمقاييس الأكثر صلة بعملك
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {websiteOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleSelect(option.type)}
                className={cn(
                  "p-6 rounded-xl border-2 text-left transition-all hover:border-primary/50 hover:shadow-lg",
                  selected === option.type
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-lg shrink-0",
                      selected === option.type
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{option.titleAr}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{option.descriptionAr}</p>
                    <ul className="space-y-1">
                      {option.featuresAr.slice(0, 3).map((feature) => (
                        <li key={feature} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Website URL Input */}
          {selected && (
            <div className="mb-8 max-w-md mx-auto">
              <label className="block text-sm font-medium mb-2">
                رابط موقعك (اختياري)
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 text-center text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Continue Button */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleContinue}
              disabled={!selected || loading}
              className={cn(
                "px-8 py-3 rounded-lg font-medium text-lg transition-all flex items-center gap-2",
                selected && !loading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  متابعة
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WebsiteTypePage;

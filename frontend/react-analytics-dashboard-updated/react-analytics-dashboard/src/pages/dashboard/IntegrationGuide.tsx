import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../components/AuthContext';
import {
  BookOpen,
  Code,
  Zap,
  Globe,
  ShoppingCart,
  FileText,
  Users,
  Video,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Key,
  Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  topics: { title: string; content: string; code?: string }[];
}

export default function IntegrationGuide() {
  const { me } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const trackingId = me?.tracking_id || null;
  const hasTrackingId = !!trackingId;

  const guideSections: GuideSection[] = [
    {
      id: 'basic',
      title: 'الأساسيات',
      icon: <BookOpen className="h-5 w-5" />,
      description: 'تعلم أساسيات التتبع والتحليلات',
      topics: [
        {
          title: 'ما هو DataFlow Analytics؟',
          content: 'DataFlow Analytics هو نظام تحليلات متقدم يتيح لك تتبع زوار موقعك وفهم سلوكهم. يوفر النظام بيانات في الوقت الفعلي عن المشاهدات، التفاعلات، والتحويلات.'
        },
        {
          title: 'كيف يعمل التتبع؟',
          content: 'يعمل التتبع عبر إضافة كود JavaScript صغير لموقعك. هذا الكود يرسل بيانات مجهولة عن الزوار إلى خوادمنا حيث يتم معالجتها وعرضها في لوحة التحكم.'
        },
        {
          title: 'البيانات المجمعة',
          content: 'نجمع: مشاهدات الصفحات، مدة الجلسة، مصدر الزيارة، نوع الجهاز، الموقع الجغرافي، والتفاعلات مع العناصر. جميع البيانات مجهولة ومتوافقة مع GDPR.'
        }
      ]
    },
    {
      id: 'pageview',
      title: 'تتبع مشاهدات الصفحات',
      icon: <Globe className="h-5 w-5" />,
      description: 'تتبع الصفحات التي يزورها المستخدمون',
      topics: [
        {
          title: 'التتبع التلقائي',
          content: 'بمجرد إضافة الكود الأساسي، يتم تتبع جميع مشاهدات الصفحات تلقائياً. لا حاجة لأي إعداد إضافي.',
          code: `// يتم تلقائياً عند تحميل الصفحة
DataFlowAnalytics.pageView();`
        },
        {
          title: 'تتبع SPA (Single Page Apps)',
          content: 'للتطبيقات أحادية الصفحة مثل React/Vue/Angular، أضف تتبع يدوي عند تغيير المسار.',
          code: `// React Router مثال
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    DataFlowAnalytics.pageView({
      path: location.pathname,
      title: document.title
    });
  }, [location]);
  
  return <Routes>...</Routes>;
}`
        },
        {
          title: 'إضافة بيانات مخصصة',
          content: 'يمكنك إضافة بيانات إضافية لكل مشاهدة صفحة.',
          code: `DataFlowAnalytics.pageView({
  path: '/products/iphone',
  title: 'iPhone 15 Pro',
  custom: {
    category: 'Electronics',
    price_range: 'premium'
  }
});`
        }
      ]
    },
    {
      id: 'events',
      title: 'تتبع الأحداث',
      icon: <Zap className="h-5 w-5" />,
      description: 'تتبع النقرات والتفاعلات والأحداث المخصصة',
      topics: [
        {
          title: 'الأحداث الأساسية',
          content: 'استخدم event() لتتبع أي تفاعل مخصص.',
          code: `// تتبع نقرة على زر
DataFlowAnalytics.event('button_click', {
  button_id: 'signup_cta',
  button_text: 'Sign Up Now',
  page: '/home'
});

// تتبع بحث
DataFlowAnalytics.event('search', {
  query: 'iphone 15',
  results_count: 24
});`
        },
        {
          title: 'تتبع التمرير',
          content: 'تتبع عمق التمرير تلقائياً عند 25%, 50%, 75%, و 100%.',
          code: `// يتم تلقائياً، أو يمكنك تتبع يدوياً
DataFlowAnalytics.trackScroll({
  thresholds: [25, 50, 75, 100],
  selector: '.article-content' // اختياري
});`
        },
        {
          title: 'تتبع النقرات التلقائي',
          content: 'تفعيل التتبع التلقائي لجميع النقرات على الروابط والأزرار.',
          code: `DataFlowAnalytics.autoTrack({
  clicks: true,
  outboundLinks: true,
  downloads: true,
  forms: true
});`
        }
      ]
    },
    {
      id: 'ecommerce',
      title: 'التجارة الإلكترونية',
      icon: <ShoppingCart className="h-5 w-5" />,
      description: 'تتبع المنتجات والمشتريات والإيرادات',
      topics: [
        {
          title: 'عرض المنتج',
          content: 'تتبع عندما يشاهد المستخدم منتج.',
          code: `DataFlowAnalytics.ecommerce.viewProduct({
  id: 'SKU-12345',
  name: 'iPhone 15 Pro',
  price: 4999,
  currency: 'SAR',
  category: 'Electronics/Phones',
  brand: 'Apple'
});`
        },
        {
          title: 'إضافة للسلة',
          content: 'تتبع عندما يضيف المستخدم منتج للسلة.',
          code: `DataFlowAnalytics.ecommerce.addToCart({
  id: 'SKU-12345',
  name: 'iPhone 15 Pro',
  price: 4999,
  quantity: 1,
  variant: '256GB - Black'
});`
        },
        {
          title: 'إتمام الشراء',
          content: 'تتبع عند إتمام عملية شراء.',
          code: `DataFlowAnalytics.ecommerce.purchase({
  transaction_id: 'TXN-98765',
  value: 5498,
  currency: 'SAR',
  tax: 825,
  shipping: 0,
  coupon: 'SAVE10',
  items: [
    { id: 'SKU-12345', name: 'iPhone 15 Pro', price: 4999, quantity: 1 },
    { id: 'SKU-67890', name: 'AirPods Pro', price: 499, quantity: 1 }
  ]
});`
        },
        {
          title: 'قمع الشراء الكامل',
          content: 'تتبع كل خطوة من قمع الشراء.',
          code: `// بدء الدفع
DataFlowAnalytics.ecommerce.beginCheckout({
  value: 5498,
  items: [...]
});

// إضافة معلومات الشحن
DataFlowAnalytics.ecommerce.addShippingInfo({
  shipping_method: 'express',
  value: 5498
});

// إضافة معلومات الدفع
DataFlowAnalytics.ecommerce.addPaymentInfo({
  payment_method: 'credit_card',
  value: 5498
});`
        }
      ]
    },
    {
      id: 'content',
      title: 'تتبع المحتوى',
      icon: <FileText className="h-5 w-5" />,
      description: 'تتبع المقالات والمدونات والمحتوى',
      topics: [
        {
          title: 'عرض المقال',
          content: 'تتبع قراءة المقالات والمحتوى.',
          code: `DataFlowAnalytics.content.viewArticle({
  id: 'article-123',
  title: '10 نصائح للإنتاجية',
  author: 'أحمد محمد',
  category: 'Productivity',
  publish_date: '2026-01-15',
  word_count: 1500
});`
        },
        {
          title: 'وقت القراءة',
          content: 'تتبع الوقت المستغرق في قراءة المحتوى.',
          code: `// يتم تلقائياً مع الكود الأساسي
// أو يمكنك تتبع يدوياً
DataFlowAnalytics.content.trackReadTime({
  article_id: 'article-123',
  time_spent: 245, // بالثواني
  scroll_depth: 85
});`
        },
        {
          title: 'تفاعل المحتوى',
          content: 'تتبع التعليقات والمشاركات.',
          code: `// تعليق
DataFlowAnalytics.content.comment({
  article_id: 'article-123',
  comment_id: 'comment-456'
});

// مشاركة
DataFlowAnalytics.content.share({
  article_id: 'article-123',
  platform: 'twitter'
});`
        }
      ]
    },
    {
      id: 'users',
      title: 'تتبع المستخدمين',
      icon: <Users className="h-5 w-5" />,
      description: 'ربط البيانات بالمستخدمين المسجلين',
      topics: [
        {
          title: 'تحديد المستخدم',
          content: 'ربط الأحداث بمستخدم محدد بعد تسجيل الدخول.',
          code: `// بعد تسجيل الدخول
DataFlowAnalytics.identify({
  user_id: 'user-12345',
  email: 'ahmed@example.com', // اختياري
  name: 'أحمد محمد', // اختياري
  plan: 'premium', // خصائص مخصصة
  signup_date: '2025-06-15'
});`
        },
        {
          title: 'إعادة تعيين المستخدم',
          content: 'إعادة تعيين هوية المستخدم عند تسجيل الخروج.',
          code: `// عند تسجيل الخروج
DataFlowAnalytics.reset();`
        },
        {
          title: 'تحديث خصائص المستخدم',
          content: 'تحديث خصائص المستخدم دون تغيير الهوية.',
          code: `DataFlowAnalytics.setUserProperties({
  plan: 'enterprise',
  team_size: 25,
  last_login: new Date().toISOString()
});`
        }
      ]
    },
    {
      id: 'video',
      title: 'تتبع الفيديو',
      icon: <Video className="h-5 w-5" />,
      description: 'تتبع مشاهدات ومشغلات الفيديو',
      topics: [
        {
          title: 'تتبع تشغيل الفيديو',
          content: 'تتبع بدء ومراحل تشغيل الفيديو.',
          code: `// بدء التشغيل
DataFlowAnalytics.video.play({
  video_id: 'video-123',
  title: 'شرح المنتج',
  duration: 180, // بالثواني
  provider: 'youtube'
});

// توقف مؤقت
DataFlowAnalytics.video.pause({
  video_id: 'video-123',
  current_time: 45
});

// اكتمال
DataFlowAnalytics.video.complete({
  video_id: 'video-123'
});`
        },
        {
          title: 'تتبع التقدم',
          content: 'تتبع نسب المشاهدة.',
          code: `// يتم تلقائياً عند 25%, 50%, 75%, 100%
DataFlowAnalytics.video.progress({
  video_id: 'video-123',
  percent: 50,
  current_time: 90
});`
        }
      ]
    }
  ];

  const copyToClipboard = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredSections = searchQuery
    ? guideSections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.topics.some(topic =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : guideSections;

  return (
    <div className="space-y-6">
      {/* بطاقة الإعداد السريع */}
      <Card className="border-2 border-primary bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">معرف التتبع الخاص بك</h3>
                {hasTrackingId ? (
                  <div className="flex items-center gap-2 mt-1">
                    <code className="px-3 py-1 bg-background rounded text-primary font-mono text-sm">
                      {trackingId}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(trackingId!);
                        setCopiedCode('tracking-id');
                        setTimeout(() => setCopiedCode(null), 2000);
                      }}
                    >
                      {copiedCode === 'tracking-id' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">لم يتم إنشاء معرف التتبع بعد</p>
                )}
              </div>
            </div>
            <Link to="/dashboard/integration/setup">
              <Button className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                صفحة الإعداد والكود
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">دليل التكامل</h1>
          <p className="text-muted-foreground">تعلم كيفية استخدام DataFlow Analytics</p>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث في الدليل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pr-10 pl-4 py-2 border rounded-lg bg-background"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {guideSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            className={cn(
              "p-4 border rounded-lg text-center transition-colors",
              expandedSection === section.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <div className="flex justify-center mb-2">{section.icon}</div>
            <div className="text-sm font-medium">{section.title}</div>
          </button>
        ))}
      </div>

      {/* Guide Sections */}
      <div className="space-y-4">
        {filteredSections.map((section) => (
          <Card key={section.id}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {section.icon}
                  <div>
                    <div>{section.title}</div>
                    <div className="text-sm font-normal text-muted-foreground">{section.description}</div>
                  </div>
                </div>
                {expandedSection === section.id ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
            {expandedSection === section.id && (
              <CardContent className="space-y-6">
                {section.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {topic.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">{topic.content}</p>
                    {topic.code && (
                      <div className="relative">
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{topic.code}</code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 left-2"
                          onClick={() => copyToClipboard(topic.code!, `${section.id}-${topicIndex}`)}
                        >
                          {copiedCode === `${section.id}-${topicIndex}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>موارد إضافية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="#" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors">
              <Code className="h-8 w-8 text-primary" />
              <div>
                <div className="font-medium">API Reference</div>
                <div className="text-sm text-muted-foreground">توثيق كامل للـ API</div>
              </div>
              <ExternalLink className="h-4 w-4 mr-auto" />
            </a>
            <a href="#" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <div className="font-medium">أمثلة عملية</div>
                <div className="text-sm text-muted-foreground">مشاريع مثال على GitHub</div>
              </div>
              <ExternalLink className="h-4 w-4 mr-auto" />
            </a>
            <a href="#" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="font-medium">مجتمع المطورين</div>
                <div className="text-sm text-muted-foreground">انضم للنقاشات</div>
              </div>
              <ExternalLink className="h-4 w-4 mr-auto" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

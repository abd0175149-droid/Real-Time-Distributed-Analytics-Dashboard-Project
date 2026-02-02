import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import {
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const features = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'تحليلات شاملة',
    description: 'تتبع كل تفاعل على موقعك مع لوحة تحكم قوية',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'تحديثات فورية',
    description: 'شاهد البيانات في الوقت الحقيقي أثناء حدوثها',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'خصوصية وأمان',
    description: 'بياناتك محمية ومشفرة بالكامل',
  },
];

const steps = [
  { number: 1, title: 'اختر نوع موقعك', description: 'سنخصص التحليلات حسب احتياجاتك' },
  { number: 2, title: 'أضف كود التتبع', description: 'نسخ ولصق بسيط في موقعك' },
  { number: 3, title: 'ابدأ التتبع', description: 'شاهد البيانات تتدفق مباشرة' },
];

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { me } = useAuth();

  const handleStart = () => {
    navigate('/onboarding/website-type');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Analytics Dashboard</h1>
          <span className="text-sm text-muted-foreground">
            مرحباً، {me?.name || 'Guest'}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              تم إنشاء حسابك بنجاح
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              مرحباً بك في منصة التحليلات
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              دعنا نساعدك في إعداد موقعك للحصول على أفضل تجربة تحليلية ممكنة. 
              سيستغرق الأمر أقل من 3 دقائق.
            </p>

            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              ابدأ الآن
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Steps */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-center mb-8">خطوات الإعداد</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
                >
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                  )}
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">
                    {step.number}
                  </div>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-semibold text-center mb-8">ما ستحصل عليه</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary hover:underline"
          >
            تخطي الإعداد والذهاب للوحة التحكم
          </button>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;

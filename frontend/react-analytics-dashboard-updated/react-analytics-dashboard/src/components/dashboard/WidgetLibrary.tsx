import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { WidgetConfig } from './DraggableWidget';
import {
  X,
  Search,
  BarChart3,
  LineChart,
  PieChart,
  Users,
  Globe,
  MousePointer,
  ShoppingCart,
  FileText,
  Video,
  TrendingUp,
  Clock,
  Target,
  Map,
  Layers,
  Activity,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface WidgetLibraryProps {
  onSelect: (widget: WidgetConfig) => void;
  onClose: () => void;
  existingWidgets: WidgetConfig[];
}

interface WidgetTemplate {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  defaultSize: 'small' | 'medium' | 'large' | 'full';
}

const widgetTemplates: WidgetTemplate[] = [
  // Overview
  {
    type: 'kpi-visitors',
    title: 'إجمالي الزوار',
    description: 'عرض إجمالي عدد الزوار مع النسبة المئوية للتغيير',
    icon: <Users className="h-5 w-5" />,
    category: 'نظرة عامة',
    defaultSize: 'small',
  },
  {
    type: 'kpi-pageviews',
    title: 'مشاهدات الصفحات',
    description: 'إجمالي مشاهدات الصفحات',
    icon: <BarChart3 className="h-5 w-5" />,
    category: 'نظرة عامة',
    defaultSize: 'small',
  },
  {
    type: 'kpi-bounce-rate',
    title: 'معدل الارتداد',
    description: 'نسبة الزوار الذين غادروا فوراً',
    icon: <TrendingUp className="h-5 w-5" />,
    category: 'نظرة عامة',
    defaultSize: 'small',
  },
  {
    type: 'kpi-session-duration',
    title: 'متوسط الجلسة',
    description: 'متوسط مدة الجلسة',
    icon: <Clock className="h-5 w-5" />,
    category: 'نظرة عامة',
    defaultSize: 'small',
  },
  {
    type: 'traffic-trend',
    title: 'اتجاه الزيارات',
    description: 'رسم بياني لاتجاه الزيارات عبر الزمن',
    icon: <LineChart className="h-5 w-5" />,
    category: 'نظرة عامة',
    defaultSize: 'large',
  },
  {
    type: 'realtime-visitors',
    title: 'الزوار الآن',
    description: 'عدد الزوار النشطين حالياً',
    icon: <Activity className="h-5 w-5" />,
    category: 'نظرة عامة',
    defaultSize: 'small',
  },

  // Audience
  {
    type: 'devices-breakdown',
    title: 'توزيع الأجهزة',
    description: 'توزيع الزوار حسب نوع الجهاز',
    icon: <PieChart className="h-5 w-5" />,
    category: 'الجمهور',
    defaultSize: 'medium',
  },
  {
    type: 'geo-map',
    title: 'خريطة الدول',
    description: 'توزيع الزوار جغرافياً',
    icon: <Globe className="h-5 w-5" />,
    category: 'الجمهور',
    defaultSize: 'large',
  },
  {
    type: 'top-countries',
    title: 'أعلى الدول',
    description: 'قائمة بأعلى الدول زيارة',
    icon: <Map className="h-5 w-5" />,
    category: 'الجمهور',
    defaultSize: 'medium',
  },
  {
    type: 'traffic-sources',
    title: 'مصادر الزيارات',
    description: 'توزيع مصادر الزيارات',
    icon: <Layers className="h-5 w-5" />,
    category: 'الجمهور',
    defaultSize: 'medium',
  },

  // Behavior
  {
    type: 'top-pages',
    title: 'أكثر الصفحات زيارة',
    description: 'قائمة بأكثر الصفحات مشاهدة',
    icon: <FileText className="h-5 w-5" />,
    category: 'السلوك',
    defaultSize: 'medium',
  },
  {
    type: 'click-heatmap',
    title: 'خريطة النقرات',
    description: 'توزيع النقرات على الصفحة',
    icon: <MousePointer className="h-5 w-5" />,
    category: 'السلوك',
    defaultSize: 'large',
  },
  {
    type: 'scroll-depth',
    title: 'عمق التمرير',
    description: 'نسبة التمرير في الصفحات',
    icon: <BarChart3 className="h-5 w-5" />,
    category: 'السلوك',
    defaultSize: 'medium',
  },
  {
    type: 'conversion-funnel',
    title: 'قمع التحويل',
    description: 'مراحل تحويل المستخدمين',
    icon: <Target className="h-5 w-5" />,
    category: 'السلوك',
    defaultSize: 'large',
  },

  // E-commerce
  {
    type: 'revenue-kpi',
    title: 'إجمالي الإيرادات',
    description: 'إجمالي الإيرادات للفترة المحددة',
    icon: <ShoppingCart className="h-5 w-5" />,
    category: 'التجارة الإلكترونية',
    defaultSize: 'small',
  },
  {
    type: 'orders-kpi',
    title: 'عدد الطلبات',
    description: 'إجمالي عدد الطلبات',
    icon: <ShoppingCart className="h-5 w-5" />,
    category: 'التجارة الإلكترونية',
    defaultSize: 'small',
  },
  {
    type: 'top-products',
    title: 'أكثر المنتجات مبيعاً',
    description: 'قائمة بأكثر المنتجات مبيعاً',
    icon: <BarChart3 className="h-5 w-5" />,
    category: 'التجارة الإلكترونية',
    defaultSize: 'medium',
  },
  {
    type: 'purchase-funnel',
    title: 'قمع الشراء',
    description: 'مراحل عملية الشراء',
    icon: <Target className="h-5 w-5" />,
    category: 'التجارة الإلكترونية',
    defaultSize: 'large',
  },

  // Content
  {
    type: 'top-articles',
    title: 'أكثر المقالات قراءة',
    description: 'قائمة بأكثر المقالات مشاهدة',
    icon: <FileText className="h-5 w-5" />,
    category: 'المحتوى',
    defaultSize: 'medium',
  },
  {
    type: 'engagement-metrics',
    title: 'مقاييس التفاعل',
    description: 'التعليقات والمشاركات والإعجابات',
    icon: <Zap className="h-5 w-5" />,
    category: 'المحتوى',
    defaultSize: 'medium',
  },

  // Video
  {
    type: 'video-views',
    title: 'مشاهدات الفيديو',
    description: 'إحصائيات مشاهدات الفيديو',
    icon: <Video className="h-5 w-5" />,
    category: 'الفيديو',
    defaultSize: 'medium',
  },
  {
    type: 'video-completion',
    title: 'معدل إكمال الفيديو',
    description: 'نسبة إكمال مشاهدة الفيديو',
    icon: <Video className="h-5 w-5" />,
    category: 'الفيديو',
    defaultSize: 'small',
  },
];

const categories = [
  'الكل',
  'نظرة عامة',
  'الجمهور',
  'السلوك',
  'التجارة الإلكترونية',
  'المحتوى',
  'الفيديو',
];

export function WidgetLibrary({ onSelect, onClose, existingWidgets }: WidgetLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const filteredWidgets = widgetTemplates.filter((widget) => {
    const matchesSearch =
      widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'الكل' || widget.category === selectedCategory;
    const notAlreadyAdded = !existingWidgets.some((w) => w.type === widget.type);

    return matchesSearch && matchesCategory && notAlreadyAdded;
  });

  const handleSelect = (template: WidgetTemplate) => {
    onSelect({
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      title: template.title,
      description: template.description,
      icon: template.icon,
      size: template.defaultSize,
      visible: true,
      category: template.category,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card w-full max-w-4xl max-h-[80vh] rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">مكتبة الـ Widgets</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="بحث عن widget..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border rounded-lg bg-background"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Widget Grid */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {filteredWidgets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد widgets متاحة للإضافة
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredWidgets.map((widget) => (
                <button
                  key={widget.type}
                  className="p-4 border rounded-lg text-right hover:border-primary hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelect(widget)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {widget.icon}
                    </div>
                    <div className="font-medium">{widget.title}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{widget.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {widget.category}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WidgetLibrary;

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Users,
  Globe,
  ShoppingCart,
  FileText,
  Code,
  ArrowRight,
  Inbox,
} from 'lucide-react';

export type EmptyStateVariant = 
  | 'default' 
  | 'analytics' 
  | 'traffic' 
  | 'audience' 
  | 'ecommerce' 
  | 'content' 
  | 'realtime'
  | 'integration';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
  variant?: EmptyStateVariant;
  className?: string;
  showIntegrationLink?: boolean;
}

// أيقونات حسب نوع الصفحة
const variantIcons: Record<EmptyStateVariant, React.ReactNode> = {
  default: <Inbox className="w-16 h-16" />,
  analytics: <BarChart3 className="w-16 h-16" />,
  traffic: <LineChart className="w-16 h-16" />,
  audience: <Users className="w-16 h-16" />,
  ecommerce: <ShoppingCart className="w-16 h-16" />,
  content: <FileText className="w-16 h-16" />,
  realtime: <Activity className="w-16 h-16" />,
  integration: <Code className="w-16 h-16" />,
};

// عناوين افتراضية حسب نوع الصفحة
const variantTitles: Record<EmptyStateVariant, string> = {
  default: 'لا توجد بيانات بعد',
  analytics: 'لا توجد تحليلات بعد',
  traffic: 'لا توجد بيانات زيارات بعد',
  audience: 'لا توجد بيانات جمهور بعد',
  ecommerce: 'لا توجد بيانات متجر بعد',
  content: 'لا توجد بيانات محتوى بعد',
  realtime: 'لا يوجد زوار حالياً',
  integration: 'لم يتم إعداد التتبع بعد',
};

// وصف افتراضي حسب نوع الصفحة
const variantDescriptions: Record<EmptyStateVariant, string> = {
  default: 'ستظهر البيانات هنا بمجرد توفرها',
  analytics: 'أضف كود التتبع إلى موقعك لبدء جمع التحليلات',
  traffic: 'ستظهر بيانات الزيارات هنا بمجرد أن يبدأ الزوار بالتفاعل مع موقعك',
  audience: 'ستظهر معلومات الجمهور هنا بمجرد تسجيل زيارات كافية',
  ecommerce: 'أضف كود تتبع المتجر لعرض المبيعات والمنتجات',
  content: 'ستظهر تحليلات المحتوى بمجرد قراءة المقالات',
  realtime: 'ستظهر الزيارات المباشرة هنا عندما يكون هناك زوار نشطون',
  integration: 'قم بإعداد كود التتبع على موقعك للبدء في جمع البيانات',
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  actionLink,
  onAction,
  variant = 'default',
  className,
  showIntegrationLink = true,
}) => {
  const displayIcon = icon || variantIcons[variant];
  const displayTitle = title || variantTitles[variant];
  const displayDescription = description || variantDescriptions[variant];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6 text-muted-foreground">
        {displayIcon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold mb-2">{displayTitle}</h3>

      {/* Description */}
      <p className="text-muted-foreground max-w-md mb-6">{displayDescription}</p>

      {/* Action Button */}
      {(actionLabel || actionLink || onAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
            >
              {actionLabel || 'إعداد التتبع'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
            >
              {actionLabel || 'إجراء'}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      )}

      {/* Integration Link */}
      {showIntegrationLink && variant !== 'integration' && !actionLink && (
        <Link
          to="/dashboard/integration/setup"
          className="mt-4 text-sm text-primary hover:underline flex items-center gap-1"
        >
          <Code className="w-4 h-4" />
          إعداد كود التتبع
        </Link>
      )}
    </div>
  );
};

// مكون مساعد لعرض Empty State في Card
export const EmptyStateCard: React.FC<EmptyStateProps & { 
  cardClassName?: string;
}> = ({ cardClassName, ...props }) => {
  return (
    <div className={cn("rounded-xl border bg-card", cardClassName)}>
      <EmptyState {...props} />
    </div>
  );
};

// مكون مساعد للتحقق من وجود بيانات
interface DataOrEmptyProps<T> {
  data: T[] | null | undefined;
  loading?: boolean;
  children: (data: T[]) => React.ReactNode;
  emptyProps?: EmptyStateProps;
  loadingComponent?: React.ReactNode;
}

export function DataOrEmpty<T>({
  data,
  loading,
  children,
  emptyProps,
  loadingComponent,
}: DataOrEmptyProps<T>) {
  if (loading) {
    return loadingComponent || (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState {...emptyProps} />;
  }

  return <>{children(data)}</>;
}

export default EmptyState;

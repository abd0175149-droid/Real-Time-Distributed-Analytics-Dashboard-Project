import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';
import { getEcommerceStats, EcommerceStats } from '../../services/dashboard';
import {
  ShoppingCart,
  Eye,
  CreditCard,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { formatNumber, formatCurrency } from '../../lib/utils';

export default function EcommerceAnalytics() {
  const { me } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EcommerceStats | null>(null);

  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  useEffect(() => {
    const fetchData = async () => {
      if (isNewUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const ecommerceData = await getEcommerceStats();
        setData(ecommerceData);
      } catch (err) {
        console.error('Error fetching ecommerce data:', err);
        setError('فشل في جلب بيانات التجارة الإلكترونية');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isNewUser]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <div>
          <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">
            تأكد من تشغيل الخادم على http://localhost:8000
          </p>
        </div>
      </div>
    );
  }

  const hasData = data && (data.productViews > 0 || data.cartAdds > 0 || data.purchases > 0);

  if (isNewUser || !hasData) {
    return (
      <EmptyState
        variant="analytics"
        title="تحليلات التجارة الإلكترونية"
        description="لم يتم تسجيل أي أحداث تجارة إلكترونية بعد. قم بإعداد تتبع التجارة الإلكترونية على موقعك."
        actionLabel="إعداد التتبع"
        actionLink="/dashboard/integration/setup"
      />
    );
  }

  const conversionRate = data.productViews > 0 
    ? Math.round((data.purchases / data.productViews) * 100 * 100) / 100
    : 0;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="مشاهدات المنتجات"
          value={data.productViews}
          format="number"
          icon={<Eye className="h-5 w-5" />}
        />
        <KPICard
          title="الإضافة للسلة"
          value={data.cartAdds}
          format="number"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <KPICard
          title="عمليات الشراء"
          value={data.purchases}
          format="number"
          icon={<CreditCard className="h-5 w-5" />}
        />
        <KPICard
          title="معدل التحويل"
          value={conversionRate}
          format="percentage"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>قمع التحويل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium">مشاهدة المنتج</div>
              <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-3"
                  style={{ width: '100%' }}
                >
                  <span className="text-white text-sm font-bold">{formatNumber(data.productViews)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium">إضافة للسلة</div>
              <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full flex items-center justify-end pr-3"
                  style={{ width: data.productViews > 0 ? `${(data.cartAdds / data.productViews) * 100}%` : '0%' }}
                >
                  <span className="text-white text-sm font-bold">{formatNumber(data.cartAdds)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium">شراء</div>
              <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full flex items-center justify-end pr-3"
                  style={{ width: data.productViews > 0 ? `${(data.purchases / data.productViews) * 100}%` : '0%' }}
                >
                  <span className="text-white text-sm font-bold">{formatNumber(data.purchases)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

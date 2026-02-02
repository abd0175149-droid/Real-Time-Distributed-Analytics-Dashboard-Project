import React, { useEffect, useState } from 'react';
import { KPICard, KPICardSkeleton } from '../../components/ui/KPICard';
import { LineChart, LineChartSkeleton } from '../../components/charts/LineChart';
import { PieChart, DonutChart, PieChartSkeleton } from '../../components/charts/PieChart';
import { BarChart } from '../../components/charts/BarChart';
import { FunnelChart } from '../../components/charts/FunnelChart';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { usePreferencesStore } from '../../store';
import { useAuth } from '../../components/AuthContext';
import { getOverviewStats, OverviewData } from '../../services/dashboard';
import {
  Users,
  MousePointer,
  TrendingDown,
  Clock,
  DollarSign,
  ShoppingCart,
  Tag,
  BookOpen,
  UserPlus,
  Repeat,
  AlertCircle,
} from 'lucide-react';
import { formatDuration, formatCurrency, truncateUrl } from '../../lib/utils';
import type { WebsiteType, TrafficMetrics, PageMetrics, DeviceMetrics, EcommerceMetrics } from '../../types';

// Type-specific mock data (only for ecommerce, blog, saas specific sections)
const getTypeSpecificData = (websiteType: WebsiteType) => {
  // Type-specific data - these will be replaced when we add specific endpoints
  const ecommerceData = {
    revenue: 0,
    previousRevenue: 0,
    orders: 0,
    previousOrders: 0,
    aov: 0,
    previousAov: 0,
    conversionRate: 0,
    funnel: [
      { name: 'Product Views', value: 0 },
      { name: 'Add to Cart', value: 0 },
      { name: 'Checkout', value: 0 },
      { name: 'Purchase', value: 0 },
    ],
    topProducts: [],
  };

  const blogData = {
    articlesRead: 0,
    avgReadTime: 0,
    scrollDepth: 0,
    topArticles: [],
  };

  const saasData = {
    signups: 0,
    previousSignups: 0,
    conversionRate: 0,
    retentionRate: 0,
    churnRate: 0,
    featureUsage: [],
  };

  return { ecommerceData, blogData, saasData };
};

export const Overview: React.FC = () => {
  const { preferences } = usePreferencesStore();
  const { me } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [hasRealData, setHasRealData] = useState<boolean | null>(null);

  // التحقق من وجود بيانات حقيقية للمستخدم
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // للمستخدمين الجدد، لا نعرض بيانات
      if (isNewUser) {
        setHasRealData(false);
        setOverviewData(null);
        setLoading(false);
        return;
      }

      try {
        // جلب البيانات الحقيقية من API
        const data = await getOverviewStats('7d');
        setOverviewData(data);
        
        // التحقق من وجود بيانات فعلية
        const hasData = data.kpiData.totalEvents > 0 || data.kpiData.visitors > 0;
        setHasRealData(hasData);
      } catch (err) {
        console.error('Error fetching overview data:', err);
        setError('فشل في جلب البيانات. تأكد من تشغيل الخادم.');
        setHasRealData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [preferences.websiteType, isNewUser]);

  if (loading) {
    return <OverviewSkeleton websiteType={preferences.websiteType} />;
  }

  // عرض رسالة خطأ
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">
              تأكد من تشغيل الخادم على http://localhost:8000
            </p>
          </div>
        </div>
      </div>
    );
  }

  // عرض Empty State للمستخدمين الجدد أو بدون بيانات
  if (isNewUser || !hasRealData || !overviewData) {
    return (
      <div className="space-y-6">
        <EmptyState
          variant="analytics"
          title="ابدأ بتتبع موقعك"
          description="لم يتم تسجيل أي بيانات بعد. قم بإعداد كود التتبع على موقعك للبدء في جمع التحليلات."
          actionLabel="إعداد التتبع"
          actionLink="/dashboard/integration/setup"
        />
      </div>
    );
  }

  // استخراج البيانات الحقيقية
  const { kpiData, trafficData, topPages, deviceData, geoData } = overviewData;
  const { ecommerceData, blogData, saasData } = getTypeSpecificData(preferences.websiteType);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Core KPIs - Always shown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Visitors"
          value={kpiData.visitors}
          previousValue={kpiData.previousVisitors}
          icon={<Users className="w-5 h-5" />}
        />
        <KPICard
          title="Sessions"
          value={kpiData.sessions}
          previousValue={kpiData.previousSessions}
          icon={<MousePointer className="w-5 h-5" />}
        />
        <KPICard
          title="Bounce Rate"
          value={kpiData.bounceRate}
          previousValue={kpiData.previousBounceRate}
          format="percentage"
          icon={<TrendingDown className="w-5 h-5" />}
          invertChange
        />
        <KPICard
          title="Avg. Duration"
          value={kpiData.avgDuration}
          previousValue={kpiData.previousAvgDuration}
          format="duration"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Type-specific KPIs */}
      {preferences.websiteType === 'ecommerce' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Revenue"
            value={ecommerceData.revenue}
            previousValue={ecommerceData.previousRevenue}
            format="currency"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KPICard
            title="Orders"
            value={ecommerceData.orders}
            previousValue={ecommerceData.previousOrders}
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <KPICard
            title="Avg. Order Value"
            value={ecommerceData.aov}
            previousValue={ecommerceData.previousAov}
            format="currency"
            icon={<Tag className="w-5 h-5" />}
          />
          <KPICard
            title="Conversion Rate"
            value={ecommerceData.conversionRate}
            format="percentage"
            icon={<TrendingDown className="w-5 h-5" />}
          />
        </div>
      )}

      {preferences.websiteType === 'blog' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="Articles Read"
            value={blogData.articlesRead}
            icon={<BookOpen className="w-5 h-5" />}
          />
          <KPICard
            title="Avg. Read Time"
            value={blogData.avgReadTime}
            format="duration"
            icon={<Clock className="w-5 h-5" />}
          />
          <KPICard
            title="Scroll Depth"
            value={blogData.scrollDepth}
            format="percentage"
            icon={<TrendingDown className="w-5 h-5" />}
          />
        </div>
      )}

      {preferences.websiteType === 'saas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Signups"
            value={saasData.signups}
            previousValue={saasData.previousSignups}
            icon={<UserPlus className="w-5 h-5" />}
          />
          <KPICard
            title="Conversion Rate"
            value={saasData.conversionRate}
            format="percentage"
            icon={<TrendingDown className="w-5 h-5" />}
          />
          <KPICard
            title="Retention Rate"
            value={saasData.retentionRate}
            format="percentage"
            icon={<Repeat className="w-5 h-5" />}
          />
          <KPICard
            title="Churn Rate"
            value={saasData.churnRate}
            format="percentage"
            invertChange
            icon={<TrendingDown className="w-5 h-5" />}
          />
        </div>
      )}

      {/* Traffic Chart */}
      <LineChart
        title="Traffic Overview"
        data={trafficData}
        lines={[
          { dataKey: 'visitors', name: 'Visitors' },
          { dataKey: 'sessions', name: 'Sessions' },
          { dataKey: 'pageviews', name: 'Pageviews' },
        ]}
        className="col-span-full"
      />

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th className="text-right">Views</th>
                  <th className="text-right">Visitors</th>
                  <th className="text-right">Avg. Time</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page) => (
                  <tr key={page.page_url}>
                    <td className="font-medium">{truncateUrl(page.page_url, 30)}</td>
                    <td className="text-right font-mono">{page.pageviews.toLocaleString()}</td>
                    <td className="text-right font-mono">{page.unique_visitors.toLocaleString()}</td>
                    <td className="text-right font-mono">{formatDuration(page.avg_time_on_page_sec)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Devices */}
        <DonutChart title="Devices" data={deviceData} />
      </div>

      {/* Type-specific sections */}
      {preferences.websiteType === 'ecommerce' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunnelChart
            title="Conversion Funnel"
            data={ecommerceData.funnel}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="text-right">Sales</th>
                    <th className="text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {ecommerceData.topProducts.map((product) => (
                    <tr key={product.name}>
                      <td className="font-medium">{product.name}</td>
                      <td className="text-right font-mono">{product.sales}</td>
                      <td className="text-right font-mono">{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {preferences.websiteType === 'blog' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Top Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th className="text-right">Views</th>
                  <th className="text-right">Read Time</th>
                </tr>
              </thead>
              <tbody>
                {blogData.topArticles.map((article) => (
                  <tr key={article.title}>
                    <td className="font-medium">{article.title}</td>
                    <td className="text-right font-mono">{article.views.toLocaleString()}</td>
                    <td className="text-right font-mono">{formatDuration(article.readTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {preferences.websiteType === 'saas' && (
        <BarChart
          title="Feature Usage"
          data={saasData.featureUsage}
          bars={[{ dataKey: 'users', name: 'Active Users' }]}
          layout="vertical"
          height={250}
        />
      )}

      {/* Geography */}
      <BarChart
        title="Top Countries"
        data={geoData}
        bars={[{ dataKey: 'value', name: 'Visitors' }]}
        height={250}
      />
    </div>
  );
};

// Skeleton component
const OverviewSkeleton: React.FC<{ websiteType: WebsiteType }> = ({ websiteType }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
    {(websiteType === 'ecommerce' || websiteType === 'saas') && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    )}
    <LineChartSkeleton />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <div className="skeleton h-64" />
        </CardContent>
      </Card>
      <PieChartSkeleton />
    </div>
  </div>
);

export default Overview;

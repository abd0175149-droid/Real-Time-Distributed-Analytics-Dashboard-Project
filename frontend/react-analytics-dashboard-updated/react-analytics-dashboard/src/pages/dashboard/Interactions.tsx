import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { BarChart } from '../../components/charts/BarChart';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';
import { getInteractionStats, InteractionStats } from '../../services/dashboard';
import {
  MousePointer,
  ArrowDown,
  Link,
  AlertCircle,
  Target
} from 'lucide-react';
import { formatNumber } from '../../lib/utils';

export default function InteractionsAnalytics() {
  const { me } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InteractionStats | null>(null);

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
        const interactionData = await getInteractionStats();
        setData(interactionData);
      } catch (err) {
        console.error('Error fetching interaction data:', err);
        setError('فشل في جلب بيانات التفاعلات');
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

  const hasData = data && (data.totalClicks > 0 || data.clicks > 0 || data.scrollEvents > 0);

  if (isNewUser || !hasData) {
    return (
      <EmptyState
        variant="analytics"
        title="تحليلات التفاعلات"
        description="لم يتم تسجيل أي تفاعلات بعد. قم بإعداد كود التتبع لبدء تتبع نقرات وتمريرات الزوار."
        actionLabel="إعداد التتبع"
        actionLink="/dashboard/integration/setup"
      />
    );
  }

  // Prepare chart data for top elements
  const topElementsData = data.topElements?.map(el => ({
    name: el.element_id || el.element || 'Unknown',
    value: el.clicks,
  })) || [];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="إجمالي النقرات"
          value={data.totalClicks || data.clicks || 0}
          format="number"
          icon={<MousePointer className="h-5 w-5" />}
        />
        <KPICard
          title="نقرات الروابط"
          value={data.linkClicks || 0}
          format="number"
          icon={<Link className="h-5 w-5" />}
        />
        <KPICard
          title="أحداث التمرير"
          value={data.scrollEvents || 0}
          format="number"
          icon={<ArrowDown className="h-5 w-5" />}
        />
        <KPICard
          title="إرسال النماذج"
          value={data.formSubmits || 0}
          format="number"
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* Top Clicked Elements */}
      {topElementsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              أكثر العناصر نقراً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={topElementsData}
              xKey="name"
              bars={[{ key: 'value', name: 'النقرات', color: '#6366f1' }]}
              height={300}
              layout="vertical"
            />
          </CardContent>
        </Card>
      )}

      {/* Elements Table */}
      {data.topElements && data.topElements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل العناصر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-medium">#</th>
                    <th className="text-right py-3 px-4 font-medium">العنصر</th>
                    <th className="text-right py-3 px-4 font-medium">المعرف</th>
                    <th className="text-right py-3 px-4 font-medium">النقرات</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topElements.map((element, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-muted-foreground">{index + 1}</td>
                      <td className="py-3 px-4 font-medium">{element.element || '-'}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                        {element.element_id || '-'}
                      </td>
                      <td className="py-3 px-4 font-mono">{formatNumber(element.clicks)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

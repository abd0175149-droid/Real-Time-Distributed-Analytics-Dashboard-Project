import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { KPICard, KPICardSkeleton } from '../../components/ui/KPICard';
import { LineChart, LineChartSkeleton } from '../../components/charts/LineChart';
import { BarChart } from '../../components/charts/BarChart';
import { DonutChart } from '../../components/charts/PieChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';
import { getTrafficStats, TrafficData } from '../../services/dashboard';
import { Users, MousePointer, TrendingDown, Clock, UserPlus, UserCheck, AlertCircle } from 'lucide-react';
import { formatDuration, formatPercentage } from '../../lib/utils';

export const Traffic: React.FC = () => {
  const { me } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrafficData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState('visitors');

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
        const trafficData = await getTrafficStats('7d');
        setData(trafficData);
      } catch (err) {
        console.error('Error fetching traffic data:', err);
        setError('فشل في جلب بيانات الزيارات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isNewUser]);

  if (loading) {
    return <TrafficSkeleton />;
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

  if (isNewUser || !data || data.totalVisitors === 0) {
    return (
      <EmptyState
        variant="traffic"
        title="لا توجد بيانات زيارات"
        description="لم يتم تسجيل أي زيارات بعد. قم بإعداد كود التتبع على موقعك لبدء تتبع الزيارات."
        actionLabel="إعداد التتبع"
        actionLink="/dashboard/integration/setup"
      />
    );
  }

  // Transform data for charts
  const userTypeData = [
    { name: 'Visitors', value: data.totalVisitors },
    { name: 'Sessions', value: data.sessions },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Visitors"
          value={data.totalVisitors}
          icon={<Users className="w-5 h-5" />}
        />
        <KPICard
          title="Sessions"
          value={data.sessions}
          icon={<MousePointer className="w-5 h-5" />}
        />
        <KPICard
          title="Bounce Rate"
          value={data.bounceRate}
          format="percentage"
          invertChange
          icon={<TrendingDown className="w-5 h-5" />}
        />
        <KPICard
          title="Avg. Duration"
          value={data.avgDuration}
          format="duration"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Main Chart */}
      {data.trafficData && data.trafficData.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Traffic Over Time</CardTitle>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visitors">Visitors</SelectItem>
                <SelectItem value="sessions">Sessions</SelectItem>
                <SelectItem value="pageviews">Pageviews</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <LineChart
              title=""
              data={data.trafficData}
              lines={[
                { dataKey: selectedMetric, name: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1) },
              ]}
              height={350}
              showLegend={false}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitors vs Sessions */}
        <DonutChart title="Visitors vs Sessions" data={userTypeData} />

        {/* Geographic Distribution */}
        {data.geoData && data.geoData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">Top Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                title=""
                data={data.geoData}
                bars={[{ dataKey: 'value', name: 'Visitors' }]}
                xAxisKey="name"
                height={250}
                showLegend={false}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Traffic Sources */}
      {data.sources && data.sources.length > 0 && (
        <BarChart
          title="Traffic Sources"
          data={data.sources}
          bars={[{ dataKey: 'value', name: 'Visitors' }]}
          xAxisKey="name"
          height={250}
        />
      )}
    </div>
  );
};

const TrafficSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
    <LineChartSkeleton />
  </div>
);

export default Traffic;

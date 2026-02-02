import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { BarChart } from '../../components/charts/BarChart';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';
import { getGeographyStats, GeographyStats } from '../../services/dashboard';
import {
  Globe,
  MapPin,
  Users,
  AlertCircle
} from 'lucide-react';
import { formatNumber, formatPercentage } from '../../lib/utils';

export default function GeographyAnalytics() {
  const { me } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GeographyStats | null>(null);

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
        const geoData = await getGeographyStats();
        setData(geoData);
      } catch (err) {
        console.error('Error fetching geography data:', err);
        setError('فشل في جلب البيانات الجغرافية');
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

  const hasData = data && data.countries && data.countries.length > 0;

  if (isNewUser || !hasData) {
    return (
      <EmptyState
        variant="analytics"
        title="التحليلات الجغرافية"
        description="لم يتم تسجيل أي بيانات جغرافية بعد. قم بإعداد كود التتبع لبدء تتبع مواقع الزوار."
        actionLabel="إعداد التتبع"
        actionLink="/dashboard/integration/setup"
      />
    );
  }

  const totalVisitors = data.countries.reduce((sum, c) => sum + c.value, 0);
  const topCountry = data.countries[0];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="إجمالي الدول"
          value={data.countries.length}
          format="number"
          icon={<Globe className="h-5 w-5" />}
        />
        <KPICard
          title="أعلى دولة"
          value={topCountry ? Math.round((topCountry.value / totalVisitors) * 100) : 0}
          format="percentage"
          icon={<MapPin className="h-5 w-5" />}
          subtitle={topCountry?.name || '-'}
        />
        <KPICard
          title="إجمالي الزوار"
          value={totalVisitors}
          format="number"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Countries Chart */}
      <Card>
        <CardHeader>
          <CardTitle>التوزيع الجغرافي</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={data.countries}
            xKey="name"
            bars={[{ key: 'value', name: 'الزوار', color: '#6366f1' }]}
            height={400}
            layout="vertical"
          />
        </CardContent>
      </Card>

      {/* Countries Table */}
      <Card>
        <CardHeader>
          <CardTitle>الدول</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.countries.map((country, index) => {
              const percentage = totalVisitors > 0 ? (country.value / totalVisitors) * 100 : 0;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 text-center font-mono text-muted-foreground">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{country.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(country.value)} زائر
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-left font-mono">
                    {formatPercentage(percentage)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

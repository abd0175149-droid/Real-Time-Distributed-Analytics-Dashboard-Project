import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { PieChart } from '../../components/charts/PieChart';
import { BarChart } from '../../components/charts/BarChart';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';
import { getDevicesStats, DeviceStats } from '../../services/dashboard';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  AlertCircle
} from 'lucide-react';
import { formatNumber, formatPercentage } from '../../lib/utils';

export default function DevicesAnalytics() {
  const { me } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DeviceStats | null>(null);

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
        const deviceData = await getDevicesStats();
        setData(deviceData);
      } catch (err) {
        console.error('Error fetching device data:', err);
        setError('فشل في جلب بيانات الأجهزة');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isNewUser]);

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return <Monitor className="h-5 w-5" />;
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'tablet': return <Tablet className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  const getDeviceColor = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return '#6366f1';
      case 'mobile': return '#22c55e';
      case 'tablet': return '#f59e0b';
      default: return '#64748b';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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

  const hasData = data && (
    (data.devices && data.devices.length > 0) ||
    (data.browsers && data.browsers.length > 0) ||
    (data.os && data.os.length > 0)
  );

  if (isNewUser || !hasData) {
    return (
      <EmptyState
        variant="analytics"
        title="تحليلات الأجهزة"
        description="لم يتم تسجيل أي بيانات أجهزة بعد. قم بإعداد كود التتبع لبدء تتبع أنواع الأجهزة."
        actionLabel="إعداد التتبع"
        actionLink="/dashboard/integration/setup"
      />
    );
  }

  // Calculate total and percentages
  const totalDevices = data.devices?.reduce((sum, d) => sum + d.value, 0) || 0;
  const deviceTypes = data.devices?.map(d => ({
    ...d,
    percentage: totalDevices > 0 ? Math.round((d.value / totalDevices) * 100) : 0,
    color: getDeviceColor(d.name),
  })) || [];

  const totalBrowsers = data.browsers?.reduce((sum, b) => sum + b.value, 0) || 0;
  const browsers = data.browsers?.map(b => ({
    ...b,
    percentage: totalBrowsers > 0 ? Math.round((b.value / totalBrowsers) * 100) : 0,
  })) || [];

  const totalOS = data.os?.reduce((sum, o) => sum + o.value, 0) || 0;
  const operatingSystems = data.os?.map(o => ({
    ...o,
    percentage: totalOS > 0 ? Math.round((o.value / totalOS) * 100) : 0,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Device Type KPIs */}
      {deviceTypes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deviceTypes.map((device) => (
            <Card key={device.name} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{device.name}</p>
                    <p className="text-3xl font-bold mt-1">{device.percentage}%</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatNumber(device.value)} جلسة
                    </p>
                  </div>
                  <div 
                    className="p-4 rounded-full"
                    style={{ backgroundColor: `${device.color}20` }}
                  >
                    {getDeviceIcon(device.name)}
                  </div>
                </div>
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ width: `${device.percentage}%`, backgroundColor: device.color }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deviceTypes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>توزيع الأجهزة</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={deviceTypes}
                dataKey="value"
                nameKey="name"
                height={300}
              />
            </CardContent>
          </Card>
        )}

        {browsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>المتصفحات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {browsers.map((browser, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{browser.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(browser.value)} ({browser.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-success rounded-full transition-all"
                        style={{ width: `${browser.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* OS */}
      {operatingSystems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>أنظمة التشغيل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operatingSystems.map((os, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{os.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(os.value)} ({os.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${os.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Screen Resolutions */}
      {data.screens && data.screens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>دقة الشاشة</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={data.screens}
              xKey="name"
              bars={[{ key: 'value', name: 'الجلسات', color: '#6366f1' }]}
              height={300}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

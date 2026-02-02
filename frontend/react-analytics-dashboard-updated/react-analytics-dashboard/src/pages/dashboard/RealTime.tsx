import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';
import { getRealTimeStats, RealTimeData } from '../../services/dashboard';
import { cn, formatRelativeTime } from '../../lib/utils';
import { Activity, Users, MousePointer, Globe, Eye, Clock, AlertCircle } from 'lucide-react';

export const RealTime: React.FC = () => {
  const { me } = useAuth();
  const [data, setData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  // التحقق من المستخدم الجديد
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  const fetchData = async () => {
    if (isNewUser) {
      setLoading(false);
      return;
    }

    try {
      const realTimeData = await getRealTimeStats();
      setData(realTimeData);
      setError(null);
    } catch (err) {
      console.error('Error fetching real-time data:', err);
      setError('فشل في جلب البيانات المباشرة');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [isNewUser]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!isLive || isNewUser) return;

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [isLive, isNewUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

  // عرض Empty State للمستخدمين الجدد أو بدون بيانات
  if (isNewUser || !data || (data.activeUsers === 0 && data.events === 0)) {
    return (
      <EmptyState
        variant="realtime"
        title="لا يوجد زوار نشطون حالياً"
        description="قم بإعداد كود التتبع على موقعك لمشاهدة الزوار في الوقت الحقيقي."
        actionLabel="إعداد التتبع"
        actionLink="/dashboard/integration/setup"
      />
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'page_view':
      case 'page_load':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'click':
      case 'mouse_click':
        return <MousePointer className="w-4 h-4 text-green-500" />;
      case 'scroll':
      case 'scroll_depth':
        return <Activity className="w-4 h-4 text-purple-500" />;
      case 'form_submit':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'page_view':
      case 'page_load':
        return 'Page View';
      case 'click':
      case 'mouse_click':
        return 'Click';
      case 'scroll':
      case 'scroll_depth':
        return 'Scroll';
      case 'form_submit':
        return 'Form Submit';
      case 'page_unload':
        return 'Page Exit';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn(
            "w-3 h-3 rounded-full",
            isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
          )} />
          <span className="text-sm font-medium">
            {isLive ? 'Live - Updating every 5 seconds' : 'Paused'}
          </span>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            isLive ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
          )}
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Users (5 min)</p>
                <p className="text-4xl font-bold mt-1">{data.activeUsers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <KPICard
          title="Page Views (5 min)"
          value={data.pageViews}
          icon={<Eye className="w-5 h-5" />}
        />

        <KPICard
          title="Total Events (5 min)"
          value={data.events}
          icon={<Activity className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Active Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topPages && data.topPages.length > 0 ? (
              <div className="space-y-3">
                {data.topPages.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate flex-1">{item.page || 'Unknown'}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${Math.min((item.views / (data.pageViews || 1)) * 100, 100)}px` }}
                      />
                      <span className="text-sm font-mono w-8 text-right">{item.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">لا توجد صفحات نشطة حالياً</p>
            )}
          </CardContent>
        </Card>

        {/* Live Event Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentEvents && data.recentEvents.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {data.recentEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors animate-slideIn"
                  >
                    {getEventIcon(event.event_type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {getEventLabel(event.event_type)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {event.page_url || 'Unknown page'}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">لا توجد أحداث حديثة</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTime;

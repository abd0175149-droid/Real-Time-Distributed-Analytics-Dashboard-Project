import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { BarChart } from '../../components/charts/BarChart';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';
import { getVideoStats, VideoStats } from '../../services/dashboard';
import {
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Video
} from 'lucide-react';
import { formatNumber, formatPercentage } from '../../lib/utils';

export default function VideosAnalytics() {
  const { me } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VideoStats | null>(null);

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
        const videoData = await getVideoStats();
        setData(videoData);
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError('فشل في جلب بيانات الفيديو');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isNewUser]);

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

  const hasData = data && (data.totalPlays > 0 || data.videos?.length > 0);

  if (isNewUser || !hasData) {
    return (
      <EmptyState
        variant="analytics"
        title="تحليلات الفيديو"
        description="لم يتم تسجيل أي مشاهدات فيديو بعد. قم بإعداد كود التتبع لبدء تتبع تفاعلات الفيديو."
        actionLabel="إعداد التتبع"
        actionLink="/dashboard/integration/setup"
      />
    );
  }

  const completionRate = data.totalPlays > 0 
    ? Math.round((data.totalCompletes / data.totalPlays) * 100) 
    : 0;

  // Prepare chart data
  const videosChartData = data.videos?.map(video => ({
    name: video.video_src?.substring(0, 30) || 'Unknown',
    plays: video.plays,
    completes: video.completes,
  })) || [];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="إجمالي التشغيلات"
          value={data.totalPlays}
          format="number"
          icon={<Play className="h-5 w-5" />}
        />
        <KPICard
          title="الاكتمالات"
          value={data.totalCompletes}
          format="number"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <KPICard
          title="معدل الاكتمال"
          value={completionRate}
          format="percentage"
          icon={<Video className="h-5 w-5" />}
        />
        <KPICard
          title="عدد الفيديوهات"
          value={data.videos?.length || 0}
          format="number"
          icon={<Video className="h-5 w-5" />}
        />
      </div>

      {/* Videos Chart */}
      {videosChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>أداء الفيديوهات</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={videosChartData}
              xKey="name"
              bars={[
                { key: 'plays', name: 'التشغيلات', color: '#6366f1' },
                { key: 'completes', name: 'الاكتمالات', color: '#22c55e' },
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      )}

      {/* Videos Table */}
      {data.videos && data.videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الفيديوهات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-medium">الفيديو</th>
                    <th className="text-right py-3 px-4 font-medium">التشغيلات</th>
                    <th className="text-right py-3 px-4 font-medium">الإيقافات</th>
                    <th className="text-right py-3 px-4 font-medium">الاكتمالات</th>
                    <th className="text-right py-3 px-4 font-medium">معدل الاكتمال</th>
                  </tr>
                </thead>
                <tbody>
                  {data.videos.map((video, index) => {
                    const rate = video.plays > 0 ? Math.round((video.completes / video.plays) * 100) : 0;
                    return (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium truncate max-w-xs">
                          {video.video_src || '-'}
                        </td>
                        <td className="py-3 px-4 font-mono">{formatNumber(video.plays)}</td>
                        <td className="py-3 px-4 font-mono">{formatNumber(video.pauses)}</td>
                        <td className="py-3 px-4 font-mono">{formatNumber(video.completes)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            rate >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            rate >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {formatPercentage(rate)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

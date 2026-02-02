import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { LineChart } from '../../components/charts/LineChart';
import { BarChart } from '../../components/charts/BarChart';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';
import { getPagesStats, PagesData } from '../../services/dashboard';
import {
  FileText,
  Clock,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Eye,
  Timer,
  TrendingUp,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { cn, formatNumber, formatDuration, formatPercentage } from '../../lib/utils';

export default function PagesAnalytics() {
  const { me } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PagesData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'pageviews' | 'avg_time_on_page_sec' | 'avg_scroll_depth'>('pageviews');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // التحقق من المستخدم الجديد
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
        const pagesData = await getPagesStats('7d');
        setData(pagesData);
      } catch (err) {
        console.error('Error fetching pages data:', err);
        setError('فشل في جلب بيانات الصفحات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isNewUser]);

  const filteredPages = useMemo(() => {
    if (!data?.pages) return [];
    
    let result = data.pages.filter(page =>
      page.page_url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return result;
  }, [data?.pages, searchTerm, sortBy, sortOrder]);

  const handleSort = (column: 'pageviews' | 'avg_time_on_page_sec' | 'avg_scroll_depth') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

  if (isNewUser || !data || data.totalPageviews === 0) {
    return (
      <EmptyState
        variant="analytics"
        title="تحليلات الصفحات"
        description="لم يتم تسجيل أي مشاهدات صفحات بعد. قم بإعداد كود التتبع لبدء تتبع أداء الصفحات."
        actionLabel="إعداد التتبع"
        actionLink="/dashboard/integration/setup"
      />
    );
  }

  // Prepare chart data
  const pageViewsTrend = data.pageviewsTrend?.map(item => ({
    date: item.date,
    views: item.pageviews,
  })) || [];

  const topLandingPages = data.pages?.slice(0, 5).map(page => ({
    page: page.page_url.length > 30 ? page.page_url.substring(0, 30) + '...' : page.page_url,
    views: page.pageviews,
  })) || [];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="إجمالي مشاهدات الصفحات"
          value={data.totalPageviews}
          format="number"
          icon={<Eye className="h-5 w-5" />}
        />
        <KPICard
          title="متوسط وقت الصفحة"
          value={data.avgTimeOnPage}
          format="duration"
          icon={<Timer className="h-5 w-5" />}
        />
        <KPICard
          title="معدل الارتداد"
          value={data.bounceRate}
          format="percentage"
          icon={<TrendingUp className="h-5 w-5" />}
          invertColors
        />
        <KPICard
          title="عدد الصفحات"
          value={data.pages?.length || 0}
          format="number"
          icon={<FileText className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pageViewsTrend.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>مشاهدات الصفحات عبر الوقت</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={pageViewsTrend}
                xKey="date"
                lines={[
                  { key: 'views', name: 'المشاهدات', color: '#6366f1' },
                ]}
                height={280}
              />
            </CardContent>
          </Card>
        )}

        {topLandingPages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>أهم الصفحات</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={topLandingPages}
                xKey="page"
                bars={[{ key: 'views', name: 'المشاهدات', color: '#6366f1' }]}
                height={280}
                layout="vertical"
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pages Table */}
      {filteredPages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>تحليل الصفحات</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="بحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-lg bg-background text-sm w-48"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-medium">الصفحة</th>
                    <th 
                      className="text-right py-3 px-4 font-medium cursor-pointer hover:text-primary"
                      onClick={() => handleSort('pageviews')}
                    >
                      المشاهدات {sortBy === 'pageviews' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th className="text-right py-3 px-4 font-medium">الزوار الفريدين</th>
                    <th 
                      className="text-right py-3 px-4 font-medium cursor-pointer hover:text-primary"
                      onClick={() => handleSort('avg_time_on_page_sec')}
                    >
                      متوسط الوقت {sortBy === 'avg_time_on_page_sec' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th 
                      className="text-right py-3 px-4 font-medium cursor-pointer hover:text-primary"
                      onClick={() => handleSort('avg_scroll_depth')}
                    >
                      عمق التمرير {sortBy === 'avg_scroll_depth' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.map((page, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="font-medium flex items-center gap-1 truncate max-w-xs">
                          {page.page_url}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">{formatNumber(page.pageviews)}</td>
                      <td className="py-3 px-4 font-mono">{formatNumber(page.unique_visitors)}</td>
                      <td className="py-3 px-4 font-mono">{formatDuration(page.avg_time_on_page_sec * 1000)}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-sm",
                          page.avg_scroll_depth > 70 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          page.avg_scroll_depth > 40 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          {page.avg_scroll_depth}%
                        </span>
                      </td>
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

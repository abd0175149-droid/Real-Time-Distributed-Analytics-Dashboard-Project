import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { BarChart } from '../../components/charts/BarChart';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';
import { getFormStats, FormStats } from '../../services/dashboard';
import {
  FileText,
  Send,
  Users,
  AlertCircle
} from 'lucide-react';
import { formatNumber } from '../../lib/utils';

export default function FormsAnalytics() {
  const { me } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FormStats | null>(null);

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
        const formData = await getFormStats();
        setData(formData);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('فشل في جلب بيانات النماذج');
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

  const hasData = data && (data.totalSubmissions > 0 || data.totalInteractions > 0);

  if (isNewUser || !hasData) {
    return (
      <EmptyState
        variant="analytics"
        title="تحليلات النماذج"
        description="لم يتم تسجيل أي تفاعلات مع النماذج بعد. قم بإعداد كود التتبع لبدء تتبع النماذج."
        actionLabel="إعداد التتبع"
        actionLink="/dashboard/integration/setup"
      />
    );
  }

  // Prepare chart data
  const formsChartData = data.forms?.map(form => ({
    name: form.form_name || form.form_id || 'Unknown',
    value: form.submissions,
  })) || [];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="إجمالي الإرسالات"
          value={data.totalSubmissions}
          format="number"
          icon={<Send className="h-5 w-5" />}
        />
        <KPICard
          title="إجمالي التفاعلات"
          value={data.totalInteractions}
          format="number"
          icon={<FileText className="h-5 w-5" />}
        />
        <KPICard
          title="عدد النماذج"
          value={data.forms?.length || 0}
          format="number"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Forms Chart */}
      {formsChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>إرسالات النماذج</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={formsChartData}
              xKey="name"
              bars={[{ key: 'value', name: 'الإرسالات', color: '#6366f1' }]}
              height={300}
            />
          </CardContent>
        </Card>
      )}

      {/* Forms Table */}
      {data.forms && data.forms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل النماذج</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-medium">النموذج</th>
                    <th className="text-right py-3 px-4 font-medium">المعرف</th>
                    <th className="text-right py-3 px-4 font-medium">الإرسالات</th>
                    <th className="text-right py-3 px-4 font-medium">المستخدمين الفريدين</th>
                  </tr>
                </thead>
                <tbody>
                  {data.forms.map((form, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{form.form_name || '-'}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                        {form.form_id || '-'}
                      </td>
                      <td className="py-3 px-4 font-mono">{formatNumber(form.submissions)}</td>
                      <td className="py-3 px-4 font-mono">{formatNumber(form.unique_users)}</td>
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

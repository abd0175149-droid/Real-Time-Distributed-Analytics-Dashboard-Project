import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';

export default function ReportsAnalytics() {
  const { me } = useAuth();
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  return (
    <EmptyState
      variant="analytics"
      title="التقارير"
      description={isNewUser 
        ? "قم بإعداد كود التتبع على موقعك لبدء إنشاء التقارير."
        : "إنشاء التقارير المخصصة سيتوفر قريباً. يمكنك مشاهدة البيانات في صفحات التحليلات المختلفة."
      }
      actionLabel="عرض نظرة عامة"
      actionLink="/dashboard/overview"
    />
  );
}

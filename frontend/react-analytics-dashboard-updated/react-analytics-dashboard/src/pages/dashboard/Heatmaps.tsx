import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';

export default function HeatmapsAnalytics() {
  const { me } = useAuth();
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  return (
    <EmptyState
      variant="analytics"
      title="خرائط الحرارة"
      description={isNewUser 
        ? "قم بإعداد كود التتبع على موقعك لبدء إنشاء خرائط الحرارة."
        : "خرائط الحرارة تتطلب تتبع حركة الماوس والنقرات. هذه الميزة المتقدمة ستتوفر قريباً."
      }
      actionLabel="إعداد التتبع"
      actionLink="/dashboard/integration/setup"
    />
  );
}

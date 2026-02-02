import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';

export default function ContentAnalytics() {
  const { me } = useAuth();
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  return (
    <EmptyState
      variant="analytics"
      title="تحليلات المحتوى"
      description={isNewUser 
        ? "قم بإعداد كود التتبع على موقعك لبدء تتبع أداء المحتوى."
        : "تحليلات المحتوى تتطلب تتبع القراءة وعمق التمرير. ستتوفر هذه الميزة قريباً."
      }
      actionLabel="إعداد التتبع"
      actionLink="/dashboard/integration/setup"
    />
  );
}

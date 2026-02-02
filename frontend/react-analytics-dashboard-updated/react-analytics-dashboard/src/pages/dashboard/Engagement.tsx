import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';

export default function EngagementAnalytics() {
  const { me } = useAuth();
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  return (
    <EmptyState
      variant="analytics"
      title="تحليلات التفاعل"
      description={isNewUser 
        ? "قم بإعداد كود التتبع على موقعك لبدء تتبع تفاعل الزوار."
        : "تحليلات التفاعل المتقدمة ستتوفر قريباً. يمكنك مشاهدة التفاعلات الأساسية في صفحة التفاعلات."
      }
      actionLabel="عرض التفاعلات"
      actionLink="/dashboard/behavior/interactions"
    />
  );
}

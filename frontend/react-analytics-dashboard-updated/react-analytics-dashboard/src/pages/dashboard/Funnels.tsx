import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';

export default function FunnelsAnalytics() {
  const { me } = useAuth();
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  return (
    <EmptyState
      variant="analytics"
      title="تحليلات القمع"
      description={isNewUser 
        ? "قم بإعداد كود التتبع على موقعك لبدء إنشاء قمع التحويل."
        : "إنشاء قمع التحويل المخصص سيتوفر قريباً."
      }
      actionLabel="إعداد التتبع"
      actionLink="/dashboard/integration/setup"
    />
  );
}

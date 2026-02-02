import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';

export default function SourcesAnalytics() {
  const { me } = useAuth();
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  // This page requires referrer tracking which needs additional implementation
  return (
    <EmptyState
      variant="analytics"
      title="تحليلات مصادر الزيارات"
      description={isNewUser 
        ? "قم بإعداد كود التتبع على موقعك لبدء تتبع مصادر الزيارات."
        : "تتبع مصادر الزيارات يتطلب إعداد إضافي. ستتوفر هذه الميزة قريباً."
      }
      actionLabel="إعداد التتبع"
      actionLink="/dashboard/integration/setup"
    />
  );
}

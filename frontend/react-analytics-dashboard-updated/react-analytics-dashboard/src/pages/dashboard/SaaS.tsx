import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';

export default function SaaSAnalytics() {
  const { me } = useAuth();
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  return (
    <EmptyState
      variant="analytics"
      title="تحليلات SaaS"
      description={isNewUser 
        ? "قم بإعداد كود التتبع على تطبيقك لبدء تتبع مقاييس SaaS."
        : "تحليلات SaaS تتطلب تتبع أحداث مخصصة مثل التسجيل والاشتراك. قم بإعداد تتبع الأحداث المخصصة."
      }
      actionLabel="إعداد التتبع"
      actionLink="/dashboard/integration/setup"
    />
  );
}

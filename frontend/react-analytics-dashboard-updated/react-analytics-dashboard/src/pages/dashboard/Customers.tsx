import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';

export default function CustomersAnalytics() {
  const { me } = useAuth();
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  return (
    <EmptyState
      variant="analytics"
      title="تحليلات العملاء"
      description={isNewUser 
        ? "قم بإعداد كود التتبع على موقعك لبدء تتبع سلوك العملاء."
        : "تحليلات العملاء تتطلب تتبع التجارة الإلكترونية. ستتوفر هذه الميزة قريباً."
      }
      actionLabel="إعداد التتبع"
      actionLink="/dashboard/integration/setup"
    />
  );
}

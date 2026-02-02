import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';

export default function PurchaseFunnelAnalytics() {
  const { me } = useAuth();
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  return (
    <EmptyState
      variant="analytics"
      title="قمع الشراء"
      description={isNewUser 
        ? "قم بإعداد كود التتبع على موقعك لبدء تتبع قمع الشراء."
        : "يمكنك مشاهدة قمع الشراء الأساسي في صفحة التجارة الإلكترونية."
      }
      actionLabel="عرض التجارة الإلكترونية"
      actionLink="/dashboard/ecommerce"
    />
  );
}

import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../components/AuthContext';

export default function ProductsAnalytics() {
  const { me } = useAuth();
  const isNewUser = !me?.is_onboarded || !me?.tracking_id;

  return (
    <EmptyState
      variant="analytics"
      title="تحليلات المنتجات"
      description={isNewUser 
        ? "قم بإعداد كود التتبع على موقعك لبدء تتبع أداء المنتجات."
        : "تحليلات المنتجات التفصيلية ستتوفر قريباً. يمكنك مشاهدة إحصائيات المنتجات في صفحة التجارة الإلكترونية."
      }
      actionLabel="عرض التجارة الإلكترونية"
      actionLink="/dashboard/ecommerce"
    />
  );
}

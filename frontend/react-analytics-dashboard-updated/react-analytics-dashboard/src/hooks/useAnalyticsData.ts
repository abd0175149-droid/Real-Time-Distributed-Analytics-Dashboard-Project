import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/AuthContext';
import { getOnboardingStatus, OnboardingStatus } from '../services/onboarding';

interface AnalyticsDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  hasData: boolean;
  isOnboarded: boolean;
  trackingId: string | null;
  refetch: () => Promise<void>;
}

interface UseAnalyticsDataOptions<T> {
  fetchFn: () => Promise<T>;
  checkHasData?: (data: T) => boolean;
  skipOnboardingCheck?: boolean;
}

/**
 * Hook لجلب بيانات التحليلات مع التحقق من حالة الـ onboarding
 */
export function useAnalyticsData<T>({
  fetchFn,
  checkHasData = () => true,
  skipOnboardingCheck = false,
}: UseAnalyticsDataOptions<T>): AnalyticsDataState<T> {
  const { me } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // التحقق من حالة الـ onboarding أولاً
      if (!skipOnboardingCheck) {
        try {
          const status = await getOnboardingStatus();
          setOnboardingStatus(status);
        } catch (e) {
          // تجاهل خطأ الـ onboarding والمتابعة
        }
      }

      // جلب البيانات
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء جلب البيانات');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, skipOnboardingCheck]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasData = data !== null && checkHasData(data);
  const isOnboarded = me?.is_onboarded ?? onboardingStatus?.is_onboarded ?? false;
  const trackingId = me?.tracking_id ?? onboardingStatus?.tracking_id ?? null;

  return {
    data,
    loading,
    error,
    hasData,
    isOnboarded,
    trackingId,
    refetch: fetchData,
  };
}

/**
 * Hook بسيط للتحقق من وجود بيانات للمستخدم
 */
export function useHasAnalyticsData() {
  const { me } = useAuth();
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkData = async () => {
      setLoading(true);
      try {
        // في بيئة التطوير، نفترض عدم وجود بيانات للمستخدمين الجدد
        // في الإنتاج، يمكن استدعاء API للتحقق
        const isOnboarded = me?.is_onboarded ?? false;
        const hasTracking = !!me?.tracking_id;
        
        // نفترض أن المستخدم لديه بيانات فقط إذا كان:
        // 1. أكمل الـ onboarding
        // 2. لديه tracking_id
        setHasData(isOnboarded && hasTracking);
      } catch (e) {
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    checkData();
  }, [me]);

  return { hasData, loading, isOnboarded: me?.is_onboarded ?? false };
}

export default useAnalyticsData;

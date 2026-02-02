import { api } from './api';

// SaaS Analytics
export interface SaaSKPIs {
  totalUsers: number;
  prevUsers: number;
  activeUsers: number;
  prevActiveUsers: number;
  newSignups: number;
  prevSignups: number;
  churnRate: number;
  prevChurnRate: number;
  mrr: number;
  prevMRR: number;
}

export interface SaaSOverviewResponse {
  kpis: SaaSKPIs;
  userTrend: { date: string; total: number; active: number; new: number; churned: number }[];
  featureUsage: { feature: string; users: number; percentage: number; trend: 'up' | 'down' | 'stable' }[];
  subscriptionPlans: { plan: string; users: number; revenue: number; percentage: number }[];
  retentionData: { week: string; retention: number }[];
  recentActivity: {
    id: string;
    user: string;
    action: string;
    timestamp: string;
    details?: string;
  }[];
}

export async function getSaaSOverview(params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<SaaSOverviewResponse> {
  const { data } = await api.get<SaaSOverviewResponse>('/analytics/saas', { params });
  return data;
}

// Signups Analytics
export interface SignupsResponse {
  kpis: {
    totalSignups: number;
    prevSignups: number;
    conversionRate: number;
    avgTimeToSignup: string;
    topSource: string;
  };
  signupTrend: { date: string; signups: number; conversions: number }[];
  signupSources: { source: string; signups: number; percentage: number; conversion: number }[];
  signupFunnel: { step: string; users: number; dropoff: number }[];
  geographyBreakdown: { country: string; signups: number }[];
}

export async function getSignupsAnalytics(params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<SignupsResponse> {
  const { data } = await api.get<SignupsResponse>('/analytics/saas/signups', { params });
  return data;
}

// Retention Analytics
export interface RetentionResponse {
  kpis: {
    day1Retention: number;
    day7Retention: number;
    day30Retention: number;
    avgSessionDuration: string;
    sessionsPerUser: number;
  };
  cohortData: {
    cohort: string;
    users: number;
    retention: number[];
  }[];
  retentionByPlan: { plan: string; day1: number; day7: number; day30: number }[];
  churnReasons: { reason: string; count: number; percentage: number }[];
  engagementScore: { score: string; users: number; retention: number }[];
}

export async function getRetentionAnalytics(params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<RetentionResponse> {
  const { data } = await api.get<RetentionResponse>('/analytics/saas/retention', { params });
  return data;
}

// Feature Usage Analytics
export interface FeatureUsageResponse {
  features: {
    id: string;
    name: string;
    category: string;
    totalUsers: number;
    activeUsers: number;
    avgUsagePerUser: number;
    trend: 'up' | 'down' | 'stable';
    satisfaction: number;
  }[];
  usageTrend: { date: string; [featureName: string]: string | number }[];
  featureAdoption: { feature: string; adoption: number; timeToAdopt: string }[];
  powerUsers: { userId: string; name: string; featuresUsed: number; lastActive: string }[];
}

export async function getFeatureUsageAnalytics(params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<FeatureUsageResponse> {
  const { data } = await api.get<FeatureUsageResponse>('/analytics/saas/features', { params });
  return data;
}

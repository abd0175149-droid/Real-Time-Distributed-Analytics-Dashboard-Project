import { api } from './api';

// Interactions Analytics
export interface ElementClick {
  element: string;
  selector: string;
  page: string;
  clicks: number;
  ctr: number;
}

export interface InteractionsAnalyticsResponse {
  kpis: {
    totalClicks: number;
    prevClicks: number;
    avgScrollDepth: number;
    prevScrollDepth: number;
    hoverRate: number;
    linkClicks: number;
  };
  clickTrend: { date: string; clicks: number; scrolls: number; hovers: number }[];
  elementTypes: { name: string; clicks: number; percentage: number }[];
  topClickedElements: ElementClick[];
  scrollDepthDistribution: { depth: string; users: number }[];
  pageInteractions: { page: string; clicks: number; avgScrollDepth: number; engagement: number }[];
}

export async function getInteractionsAnalytics(params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<InteractionsAnalyticsResponse> {
  const { data } = await api.get<InteractionsAnalyticsResponse>('/analytics/interactions', { params });
  return data;
}

// Heatmaps Analytics
export interface HeatmapZone {
  id: string;
  name: string;
  clicks: number;
  attention: number;
  scrollReach: number;
}

export interface HeatmapsAnalyticsResponse {
  kpis: {
    totalHotZones: number;
    avgClickDensity: number;
    scrollCompletion: number;
    attentionScore: number;
  };
  zones: HeatmapZone[];
  clickDistribution: { position: string; clicks: number }[];
  scrollDepthData: { depth: string; users: number }[];
  deviceComparison: {
    device: string;
    clicks: number;
    scrollDepth: number;
    hotZones: number;
  }[];
  pageHeatmaps: {
    page: string;
    totalClicks: number;
    avgAttention: number;
    hotZones: number;
    coldZones: number;
    lastUpdated: string;
  }[];
}

export async function getHeatmapsAnalytics(params?: {
  page?: string;
  device?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<HeatmapsAnalyticsResponse> {
  const { data } = await api.get<HeatmapsAnalyticsResponse>('/analytics/heatmaps', { params });
  return data;
}

// Funnels Analytics
export interface FunnelStep {
  id: string;
  name: string;
  visitors: number;
  conversionRate: number;
  dropoffRate: number;
  avgTimeSpent: string;
}

export interface FunnelsAnalyticsResponse {
  kpis: {
    totalFunnels: number;
    avgConversion: number;
    prevConversion: number;
    biggestDropoff: string;
    dropoffRate: number;
    completedGoals: number;
  };
  steps: FunnelStep[];
  conversionTrend: { date: string; conversion: number; visitors: number; completed: number }[];
  dropoffReasons: { reason: string; percentage: number; count: number }[];
  savedFunnels: {
    id: string;
    name: string;
    steps: number;
    totalConversion: number;
    lastUpdated: string;
  }[];
  stepComparison: { step: string; thisWeek: number; lastWeek: number }[];
}

export async function getFunnelsAnalytics(params?: {
  funnelId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<FunnelsAnalyticsResponse> {
  const { data } = await api.get<FunnelsAnalyticsResponse>('/analytics/funnels', { params });
  return data;
}

export async function createFunnel(data: {
  name: string;
  steps: { name: string; url?: string; event?: string }[];
}): Promise<{ id: string; name: string }> {
  const response = await api.post('/analytics/funnels', data);
  return response.data;
}

export async function deleteFunnel(funnelId: string): Promise<void> {
  await api.delete(`/analytics/funnels/${funnelId}`);
}

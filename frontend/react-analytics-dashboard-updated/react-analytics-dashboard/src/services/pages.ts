import { api } from './api';

export interface PageStats {
  path: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  exitRate: number;
  entrances: number;
}

export interface PageTrend {
  date: string;
  views: number;
  uniqueVisitors: number;
}

export interface PagesAnalyticsResponse {
  kpis: {
    totalPageViews: number;
    prevPageViews: number;
    uniquePages: number;
    avgTimeOnPage: number;
    prevAvgTime: number;
    bounceRate: number;
    prevBounceRate: number;
  };
  pages: PageStats[];
  trend: PageTrend[];
  topLandingPages: PageStats[];
  topExitPages: PageStats[];
}

export async function getPagesAnalytics(params?: {
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}): Promise<PagesAnalyticsResponse> {
  const { data } = await api.get<PagesAnalyticsResponse>('/analytics/pages', { params });
  return data;
}

export async function getPageDetails(path: string, params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<PageStats & { trend: PageTrend[] }> {
  const { data } = await api.get(`/analytics/pages/details`, { params: { path, ...params } });
  return data;
}

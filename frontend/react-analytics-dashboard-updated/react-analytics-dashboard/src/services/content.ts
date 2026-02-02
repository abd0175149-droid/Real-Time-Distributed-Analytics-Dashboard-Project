import { api } from './api';

// Content/Blog Analytics
export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  publishDate: string;
  views: number;
  uniqueViews: number;
  avgReadTime: number;
  scrollDepth: number;
  comments: number;
  shares: number;
  likes: number;
  engagementRate: number;
}

export interface ContentOverviewResponse {
  kpis: {
    totalArticles: number;
    totalViews: number;
    prevViews: number;
    avgReadTime: number;
    prevReadTime: number;
    avgScrollDepth: number;
    shareRate: number;
  };
  topArticles: Article[];
  categoryPerformance: { category: string; articles: number; views: number; avgEngagement: number }[];
  viewsTrend: { date: string; views: number; uniqueViews: number }[];
  readingDepth: { depth: string; percentage: number }[];
  engagementMetrics: { metric: string; value: number; change: number }[];
}

export async function getContentOverview(params?: {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<ContentOverviewResponse> {
  const { data } = await api.get<ContentOverviewResponse>('/analytics/content', { params });
  return data;
}

// Content Engagement Analytics
export interface EngagementResponse {
  kpis: {
    totalEngagements: number;
    prevEngagements: number;
    avgEngagementRate: number;
    totalComments: number;
    totalShares: number;
    avgReadTime: string;
  };
  engagementTrend: { date: string; comments: number; shares: number; likes: number; bookmarks: number }[];
  engagementTypes: { name: string; value: number; count: number }[];
  commentSentiment: { sentiment: string; count: number; percentage: number }[];
  socialShares: { platform: string; shares: number; percentage: number }[];
  engagementByCategory: { category: string; engagement: number; articles: number }[];
  topEngagingArticles: Article[];
  readingDepthData: { depth: string; users: number }[];
}

export async function getContentEngagement(params?: {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<EngagementResponse> {
  const { data } = await api.get<EngagementResponse>('/analytics/content/engagement', { params });
  return data;
}

export async function getArticleDetails(articleId: string): Promise<Article & {
  trend: { date: string; views: number; engagement: number }[];
  topReferrers: { referrer: string; views: number }[];
}> {
  const { data } = await api.get(`/analytics/content/articles/${articleId}`);
  return data;
}

import { api } from './api';

export interface VideoStats {
  id: string;
  title: string;
  duration: number;
  views: number;
  uniqueViews: number;
  avgWatchTime: number;
  completionRate: number;
  engagement: number;
  likes: number;
  shares: number;
}

export interface VideosAnalyticsResponse {
  kpis: {
    totalViews: number;
    prevViews: number;
    totalPlaytime: number;
    prevPlaytime: number;
    avgCompletion: number;
    prevCompletion: number;
    engagement: number;
    prevEngagement: number;
  };
  videos: VideoStats[];
  viewsTrend: { date: string; views: number; completions: number; engagement: number }[];
  watchProgress: { progress: string; viewers: number; percentage: number }[];
  engagementActions: { action: string; count: number; percentage: number }[];
  topPerformingVideos: VideoStats[];
  deviceBreakdown: { device: string; views: number; avgWatchTime: number }[];
}

export async function getVideosAnalytics(params?: {
  videoId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<VideosAnalyticsResponse> {
  const { data } = await api.get<VideosAnalyticsResponse>('/analytics/videos', { params });
  return data;
}

export async function getVideoDetails(videoId: string): Promise<VideoStats & {
  trend: { date: string; views: number; completions: number }[];
  dropoffPoints: { time: number; viewers: number }[];
  topReferrers: { referrer: string; views: number }[];
}> {
  const { data } = await api.get(`/analytics/videos/${videoId}`);
  return data;
}

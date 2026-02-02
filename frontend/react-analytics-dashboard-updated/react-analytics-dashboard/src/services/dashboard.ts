import { api } from './api';

// Types for dashboard data
export interface KPIData {
  visitors: number;
  previousVisitors: number;
  sessions: number;
  previousSessions: number;
  pageviews: number;
  bounceRate: number;
  previousBounceRate: number;
  avgDuration: number;
  previousAvgDuration: number;
  totalEvents: number;
}

export interface TrafficDataPoint {
  timestamp: string;
  visitors: number;
  sessions: number;
  pageviews: number;
}

export interface PageMetrics {
  page_url: string;
  pageviews: number;
  unique_visitors: number;
  avg_time_on_page_sec: number;
  avg_scroll_depth: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface DeviceStats {
  devices: ChartDataPoint[];
  browsers: ChartDataPoint[];
  os: ChartDataPoint[];
  screens: ChartDataPoint[];
}

export interface OverviewData {
  kpiData: KPIData;
  trafficData: TrafficDataPoint[];
  topPages: PageMetrics[];
  deviceData: ChartDataPoint[];
  geoData: ChartDataPoint[];
}

export interface TrafficData {
  totalVisitors: number;
  sessions: number;
  pageviews: number;
  bounceRate: number;
  avgDuration: number;
  trafficData: TrafficDataPoint[];
  geoData: ChartDataPoint[];
  sources: ChartDataPoint[];
}

export interface RealTimeData {
  activeUsers: number;
  pageViews: number;
  events: number;
  topPages: { page: string; views: number }[];
  recentEvents: { timestamp: string; event_type: string; page_url: string; session_id: string }[];
}

export interface PagesData {
  pages: PageMetrics[];
  totalPageviews: number;
  avgTimeOnPage: number;
  bounceRate: number;
  pageviewsTrend: { date: string; pageviews: number }[];
}

export interface BehaviorData {
  clicks: number;
  linkClicks: number;
  scrollEvents: number;
  formSubmits: number;
}

// API Functions

/**
 * Get overview statistics for dashboard
 */
export async function getOverviewStats(period: string = '7d'): Promise<OverviewData> {
  const { data } = await api.get<{ status: string; data: OverviewData }>(`/dashboard/overview?period=${period}`);
  return data.data;
}

/**
 * Get traffic analytics
 */
export async function getTrafficStats(period: string = '7d'): Promise<TrafficData> {
  const { data } = await api.get<{ status: string; data: TrafficData }>(`/dashboard/traffic?period=${period}`);
  return data.data;
}

/**
 * Get real-time statistics
 */
export async function getRealTimeStats(): Promise<RealTimeData> {
  const { data } = await api.get<{ status: string; data: RealTimeData }>('/dashboard/realtime');
  return data.data;
}

/**
 * Get pages analytics
 */
export async function getPagesStats(period: string = '7d'): Promise<PagesData> {
  const { data } = await api.get<{ status: string; data: PagesData }>(`/dashboard/pages?period=${period}`);
  return data.data;
}

/**
 * Get devices analytics
 */
export async function getDevicesStats(): Promise<DeviceStats> {
  const { data } = await api.get<{ status: string; data: DeviceStats }>('/dashboard/devices');
  return data.data;
}

/**
 * Get behavior analytics
 */
export async function getBehaviorStats(): Promise<BehaviorData> {
  const { data } = await api.get<{ status: string; data: BehaviorData }>('/dashboard/behavior');
  return data.data;
}

// Additional Types
export interface FormStats {
  forms: { form_id: string; form_name: string; submissions: number; unique_users: number }[];
  totalSubmissions: number;
  totalInteractions: number;
}

export interface VideoStats {
  videos: { video_src: string; plays: number; pauses: number; completes: number }[];
  totalPlays: number;
  totalCompletes: number;
}

export interface InteractionStats {
  totalClicks: number;
  linkClicks: number;
  buttonClicks: number;
  topElements: { element: string; element_id: string; clicks: number }[];
  clicks: number;
  scrollEvents: number;
  formSubmits: number;
}

export interface GeographyStats {
  countries: ChartDataPoint[];
}

export interface EcommerceStats {
  productViews: number;
  cartAdds: number;
  purchases: number;
  revenue: number;
}

/**
 * Get form analytics
 */
export async function getFormStats(): Promise<FormStats> {
  const { data } = await api.get<{ status: string; data: FormStats }>('/dashboard/forms');
  return data.data;
}

/**
 * Get video analytics
 */
export async function getVideoStats(): Promise<VideoStats> {
  const { data } = await api.get<{ status: string; data: VideoStats }>('/dashboard/videos');
  return data.data;
}

/**
 * Get interactions/clicks analytics
 */
export async function getInteractionStats(): Promise<InteractionStats> {
  const { data } = await api.get<{ status: string; data: InteractionStats }>('/dashboard/interactions');
  return data.data;
}

/**
 * Get geography analytics
 */
export async function getGeographyStats(): Promise<GeographyStats> {
  const { data } = await api.get<{ status: string; data: GeographyStats }>('/dashboard/geography');
  return data.data;
}

/**
 * Get ecommerce analytics
 */
export async function getEcommerceStats(): Promise<EcommerceStats> {
  const { data } = await api.get<{ status: string; data: EcommerceStats }>('/dashboard/ecommerce');
  return data.data;
}

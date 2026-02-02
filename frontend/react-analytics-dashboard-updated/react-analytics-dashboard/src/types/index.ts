// Website Types
export type WebsiteType = 
  | 'ecommerce' 
  | 'blog' 
  | 'saas' 
  | 'landing' 
  | 'portfolio' 
  | 'news' 
  | 'custom';

// User Preferences
export interface UserPreferences {
  websiteType: WebsiteType;
  dashboardLayout: DashboardLayout;
  sidebarSections: SidebarConfig;
  defaultDateRange: DateRange;
  theme: Theme;
}

export interface DashboardLayout {
  widgets: Widget[];
  order: string[];
  sizes: Record<string, WidgetSize>;
}

export interface SidebarConfig {
  hidden: string[];
  customOrder: string[];
}

export type DateRange = '7d' | '30d' | '90d' | 'custom';
export type Theme = 'light' | 'dark' | 'system';
export type WidgetSize = 'sm' | 'md' | 'lg' | 'full';

// Widget Types
export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  visible: boolean;
  position: number;
  config?: Record<string, unknown>;
}

export type WidgetType = 
  | 'kpi'
  | 'line-chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'table'
  | 'map'
  | 'funnel'
  | 'live-feed'
  | 'heatmap';

// User Model
export interface User {
  id: string;
  name: string;
  email: string;
  company_name?: string;
  roles: string[];
  tracking_id: string;
  preferences?: UserPreferences;
  created_at: string;
  is_active: boolean;
  email_verified_at?: string;
}

// Analytics Models
export interface TrafficMetrics {
  timestamp: string;
  interval_type: string;
  tracking_id: string;
  unique_users: number;
  new_users: number;
  returning_users: number;
  total_sessions: number;
  bounce_sessions: number;
  bounce_rate: number;
  total_pageviews: number;
  unique_pageviews: number;
  avg_pages_per_session: number;
  avg_session_duration_sec: number;
  total_time_on_site_sec: number;
}

export interface PageMetrics {
  timestamp: string;
  interval_type: string;
  tracking_id: string;
  page_url: string;
  pageviews: number;
  unique_visitors: number;
  avg_time_on_page_sec: number;
  avg_scroll_depth: number;
  total_clicks: number;
  avg_load_time_ms: number;
  p50_load_time_ms: number;
  p95_load_time_ms: number;
  entries: number;
  exits: number;
  bounces: number;
}

export interface DeviceMetrics {
  timestamp: string;
  interval_type: string;
  tracking_id: string;
  device_type: string;
  operating_system: string;
  browser: string;
  sessions: number;
  unique_users: number;
  pageviews: number;
  avg_session_duration_sec: number;
  bounce_rate: number;
}

export interface GeoMetrics {
  timestamp: string;
  interval_type: string;
  tracking_id: string;
  country: string;
  country_code: string;
  sessions: number;
  unique_users: number;
  pageviews: number;
  avg_session_duration_sec: number;
  bounce_rate: number;
}

export interface SourceMetrics {
  timestamp: string;
  interval_type: string;
  tracking_id: string;
  source: string;
  referrer: string;
  sessions: number;
  unique_users: number;
  pageviews: number;
  avg_session_duration_sec: number;
  bounce_rate: number;
}

export interface FormMetrics {
  timestamp: string;
  interval_type: string;
  tracking_id: string;
  form_id: string;
  form_name: string;
  starts: number;
  submissions: number;
  successful_submissions: number;
  completion_rate: number;
}

export interface EcommerceMetrics {
  timestamp: string;
  interval_type: string;
  tracking_id: string;
  product_views: number;
  cart_adds: number;
  cart_removes: number;
  checkouts: number;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  unique_customers: number;
  view_to_cart_rate: number;
  cart_to_checkout_rate: number;
  checkout_to_purchase_rate: number;
}

export interface ProductMetrics {
  date: string;
  tracking_id: string;
  product_id: string;
  product_name: string;
  category: string;
  views: number;
  cart_adds: number;
  purchases: number;
  quantity_sold: number;
  revenue: number;
}

export interface VideoMetrics {
  date: string;
  tracking_id: string;
  video_src: string;
  plays: number;
  completions: number;
  completion_rate: number;
  watched_25_percent: number;
  watched_50_percent: number;
  watched_75_percent: number;
  unique_viewers: number;
}

export interface ConversionFunnel {
  date: string;
  tracking_id: string;
  funnel_step: string;
  users: number;
  conversion_rate: number;
}

// Real-time Stats
export interface RealTimeStats {
  active_users: number;
  page_views_last_5min: number;
  events_last_5min: number;
  active_pages: ActivePage[];
  recent_events: RecentEvent[];
  geo_distribution: GeoPoint[];
}

export interface ActivePage {
  page_url: string;
  active_users: number;
}

export interface RecentEvent {
  timestamp: string;
  event_type: string;
  page_url: string;
  user_id: string;
  device_type: string;
  country: string;
}

export interface GeoPoint {
  country: string;
  country_code: string;
  users: number;
  lat: number;
  lng: number;
}

// Session Model
export interface Session {
  session_id: string;
  user_id: string;
  tracking_id: string;
  start_time: string;
  end_time?: string;
  device_type: string;
  operating_system: string;
  browser: string;
  country?: string;
  country_code?: string;
  entry_page: string;
  exit_page?: string;
  duration_ms?: number;
  bounce: boolean;
  page_views: number;
}

// API Response Types
export interface ApiResponse<T> {
  status: 'ok' | 'error';
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

// Dashboard Overview Stats
export interface DashboardOverview {
  traffic: TrafficMetrics;
  topPages: PageMetrics[];
  deviceBreakdown: DeviceMetrics[];
  geoBreakdown: GeoMetrics[];
  sourceBreakdown: SourceMetrics[];
  // Type-specific
  ecommerce?: EcommerceMetrics;
  topProducts?: ProductMetrics[];
  contentMetrics?: ContentMetrics;
  saasMetrics?: SaaSMetrics;
}

// Content-specific metrics (for blogs)
export interface ContentMetrics {
  total_articles: number;
  avg_read_time_sec: number;
  avg_scroll_depth: number;
  social_shares: number;
  comments: number;
  top_articles: ArticleMetrics[];
}

export interface ArticleMetrics {
  url: string;
  title: string;
  views: number;
  avg_read_time_sec: number;
  scroll_depth: number;
  shares: number;
}

// SaaS-specific metrics
export interface SaaSMetrics {
  signups_today: number;
  signups_total: number;
  trial_to_paid_rate: number;
  churn_rate: number;
  retention_rate: number;
  feature_adoption: FeatureAdoption[];
}

export interface FeatureAdoption {
  feature_name: string;
  users_count: number;
  adoption_rate: number;
}

// Interaction/Heatmap data
export interface ClickPoint {
  x: number;
  y: number;
  count: number;
  element?: string;
}

export interface HeatmapData {
  page_url: string;
  clicks: ClickPoint[];
  scroll_depth: ScrollDepthData[];
}

export interface ScrollDepthData {
  depth_percent: number;
  users_reached: number;
}

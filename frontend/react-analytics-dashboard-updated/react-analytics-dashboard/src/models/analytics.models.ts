import type { MeResponse } from '../services/auth';

// =============================================================================
// Base Types
// =============================================================================

export interface AnalyticsEventRow {
  timestamp: string;      // ISO
  event_type: string;
  page_url: string;
  tracking_id: string;
  session_id?: string | null;
  page_title?: string;
  referrer?: string;
}

export interface AnalyticsResponse {
  user: MeResponse;
  events_count: number;
  last_events: AnalyticsEventRow[];
}

// =============================================================================
// Tracking Event Types (for Tracker SDK)
// =============================================================================

/**
 * Base event interface - all events must have these fields
 */
export interface BaseTrackingEvent {
  tracking_id: string;
  session_id: string;
  user_id: string;
  type: string;
  url?: string;
  page_url?: string;
  timestamp?: string;
}

/**
 * Screen resolution
 */
export interface ScreenResolution {
  width: number;
  height: number;
  available_width?: number;
  available_height?: number;
  color_depth?: number;
}

/**
 * Viewport dimensions
 */
export interface Viewport {
  width: number;
  height: number;
}

/**
 * Geographic location
 */
export interface GeoLocation {
  country?: string;
  country_code?: string;
  city?: string;
  region?: string;
  postal?: string;
  ip?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Network information
 */
export interface NetworkInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  dns_time?: number;
  connect_time?: number;
  response_time?: number;
  dom_load_time?: number;
  page_load_time?: number;
}

/**
 * Page Load Event - sent when a page first loads
 */
export interface PageLoadEvent extends BaseTrackingEvent {
  type: 'page_load';
  data: {
    url: string;
    referrer: string;
    title: string;
    screen_resolution: ScreenResolution;
    viewport: Viewport;
    operating_system: string;
    browser: string;
    language: string;
    timezone: string;
    device_type: 'Mobile' | 'Tablet' | 'Desktop';
    location?: GeoLocation;
    network?: NetworkInfo;
    performance?: PerformanceMetrics;
    page_load_time?: number;
  };
}

/**
 * Page View Event - sent for each page view
 */
export interface PageViewEvent extends BaseTrackingEvent {
  type: 'page_view';
  page_url: string;
  page_title: string;
}

/**
 * Page Unload Event - sent when leaving a page
 */
export interface PageUnloadEvent extends BaseTrackingEvent {
  type: 'page_unload';
  duration_ms?: number;
  scroll_depth_max?: number;
  click_count?: number;
}

/**
 * Click Event
 */
export interface ClickEvent extends BaseTrackingEvent {
  type: 'click' | 'mouse_click';
  x: number;
  y: number;
  element?: string;
  element_id?: string;
  element_class?: string;
  text?: string;
}

/**
 * Link Click Event
 */
export interface LinkClickEvent extends BaseTrackingEvent {
  type: 'link_click';
  href: string;
  text?: string;
  is_external?: boolean;
}

/**
 * Scroll Event
 */
export interface ScrollEvent extends BaseTrackingEvent {
  type: 'scroll' | 'scroll_depth';
  depth_percent?: number;
  scroll_top?: number;
}

/**
 * Form Event
 */
export interface FormEvent extends BaseTrackingEvent {
  type: 'form_focus' | 'form_input' | 'form_submit';
  form_id: string;
  form_name?: string;
  action?: string;
  method?: string;
  field_name?: string;
  field_type?: string;
  field_count?: number;
  has_file_upload?: boolean;
  success?: boolean;
}

/**
 * Video Event
 */
export interface VideoEvent extends BaseTrackingEvent {
  type: 'video_play' | 'video_pause' | 'video_complete' | 'play' | 'pause' | 'complete' | 'progress_25' | 'progress_50' | 'progress_75';
  video_src: string;
  video_duration?: number;
  current_time?: number;
}

/**
 * E-commerce Event
 */
export interface EcommerceEvent extends BaseTrackingEvent {
  type: 'product_view' | 'cart_add' | 'cart_remove' | 'checkout_step' | 'purchase';
  product_id?: string;
  product_name?: string;
  price?: number;
  quantity?: number;
  category?: string;
  currency?: string;
  order_id?: string;
  total?: number;
  step?: number;
  step_name?: string;
}

/**
 * Custom Event
 */
export interface CustomEvent extends BaseTrackingEvent {
  type: 'custom';
  event_name: string;
  properties?: Record<string, any>;
}

/**
 * Union type for all tracking events
 */
export type TrackingEvent =
  | PageLoadEvent
  | PageViewEvent
  | PageUnloadEvent
  | ClickEvent
  | LinkClickEvent
  | ScrollEvent
  | FormEvent
  | VideoEvent
  | EcommerceEvent
  | CustomEvent;

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Track API Response
 */
export interface TrackResponse {
  status: 'ok' | 'error';
  message: string;
  event_type?: string;
}

/**
 * Batch Track Response
 */
export interface BatchTrackResponse {
  status: 'ok' | 'error';
  message: string;
  success_count: number;
  fail_count: number;
  total: number;
}

/**
 * Real-time Stats Response
 */
export interface RealTimeStats {
  active_users: number;
  page_views: number;
  events: number;
}

/**
 * Traffic Metrics
 */
export interface TrafficMetrics {
  timestamp: string;
  interval_type: '5m' | '1h' | '1d';
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
}

/**
 * Device Metrics
 */
export interface DeviceMetrics {
  device_type: string;
  operating_system: string;
  browser: string;
  sessions: number;
  unique_users: number;
  pageviews: number;
}

/**
 * Geo Metrics
 */
export interface GeoMetrics {
  country: string;
  country_code: string;
  sessions: number;
  unique_users: number;
  pageviews: number;
}

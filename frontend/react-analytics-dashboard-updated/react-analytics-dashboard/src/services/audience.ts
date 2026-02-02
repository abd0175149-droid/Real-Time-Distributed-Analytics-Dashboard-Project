import { api } from './api';

// Device Analytics
export interface DeviceStats {
  type: string;
  count: number;
  percentage: number;
}

export interface DevicesAnalyticsResponse {
  kpis: {
    totalSessions: number;
    desktopPercentage: number;
    mobilePercentage: number;
    tabletPercentage: number;
  };
  devices: DeviceStats[];
  operatingSystems: DeviceStats[];
  browsers: DeviceStats[];
  screenResolutions: DeviceStats[];
  trend: { date: string; desktop: number; mobile: number; tablet: number }[];
}

export async function getDevicesAnalytics(params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<DevicesAnalyticsResponse> {
  const { data } = await api.get<DevicesAnalyticsResponse>('/analytics/devices', { params });
  return data;
}

// Geography Analytics
export interface GeoStats {
  country: string;
  countryCode: string;
  visitors: number;
  percentage: number;
}

export interface CityStats {
  city: string;
  country: string;
  visitors: number;
}

export interface GeographyAnalyticsResponse {
  kpis: {
    totalCountries: number;
    topCountry: string;
    topCountryPercentage: number;
    newCountries: number;
  };
  countries: GeoStats[];
  cities: CityStats[];
  languages: { language: string; visitors: number; percentage: number }[];
  regions: { region: string; visitors: number }[];
}

export async function getGeographyAnalytics(params?: {
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}): Promise<GeographyAnalyticsResponse> {
  const { data } = await api.get<GeographyAnalyticsResponse>('/analytics/geography', { params });
  return data;
}

// Traffic Sources Analytics
export interface SourceStats {
  source: string;
  visitors: number;
  percentage: number;
  bounceRate: number;
  avgDuration: number;
}

export interface SourcesAnalyticsResponse {
  kpis: {
    totalSources: number;
    directPercentage: number;
    organicPercentage: number;
    referralPercentage: number;
    socialPercentage: number;
  };
  sources: SourceStats[];
  searchEngines: { engine: string; visitors: number; percentage: number }[];
  socialPlatforms: { platform: string; visitors: number; percentage: number }[];
  referrers: { referrer: string; visitors: number }[];
  campaigns: { campaign: string; visitors: number; conversions: number }[];
  trend: { date: string; direct: number; organic: number; referral: number; social: number }[];
}

export async function getSourcesAnalytics(params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<SourcesAnalyticsResponse> {
  const { data } = await api.get<SourcesAnalyticsResponse>('/analytics/sources', { params });
  return data;
}

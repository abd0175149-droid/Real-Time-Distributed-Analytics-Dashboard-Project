import { api } from './api';

// E-commerce Overview
export interface EcommerceKPIs {
  totalRevenue: number;
  prevRevenue: number;
  totalOrders: number;
  prevOrders: number;
  avgOrderValue: number;
  prevAOV: number;
  conversionRate: number;
  prevConversion: number;
  cartAbandonment: number;
  prevAbandonment: number;
}

export interface EcommerceOverviewResponse {
  kpis: EcommerceKPIs;
  revenueTrend: { date: string; revenue: number; orders: number }[];
  conversionFunnel: { step: string; visitors: number; percentage: number }[];
  topProducts: {
    id: string;
    name: string;
    revenue: number;
    units: number;
    conversion: number;
  }[];
  topCategories: { category: string; revenue: number; percentage: number }[];
  paymentMethods: { method: string; count: number; percentage: number }[];
}

export async function getEcommerceOverview(params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<EcommerceOverviewResponse> {
  const { data } = await api.get<EcommerceOverviewResponse>('/analytics/ecommerce', { params });
  return data;
}

// Products Analytics
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  views: number;
  addedToCart: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
  rating: number;
  stock: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ProductsAnalyticsResponse {
  kpis: {
    totalProducts: number;
    activeProducts: number;
    topSeller: string;
    topSellerRevenue: number;
    avgConversion: number;
    lowStockProducts: number;
  };
  products: Product[];
  performanceTrend: { date: string; views: number; cartAdds: number; purchases: number }[];
  categoryPerformance: { name: string; revenue: number; percentage: number }[];
}

export async function getProductsAnalytics(params?: {
  category?: string;
  sortBy?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}): Promise<ProductsAnalyticsResponse> {
  const { data } = await api.get<ProductsAnalyticsResponse>('/analytics/ecommerce/products', { params });
  return data;
}

// Purchase Funnel
export interface PurchaseFunnelResponse {
  kpis: {
    totalVisitors: number;
    completedPurchases: number;
    overallConversion: number;
    avgOrderValue: number;
    cartAbandonment: number;
  };
  steps: {
    name: string;
    visitors: number;
    value: number;
    conversionRate: number;
    dropoffRate: number;
    avgTime: string;
  }[];
  conversionTrend: { date: string; visitors: number; purchases: number; conversion: number }[];
  dropoffReasons: { reason: string; percentage: number; count: number }[];
  deviceBreakdown: { device: string; visitors: number; conversion: number; revenue: number }[];
  timeToConvert: { time: string; percentage: number; value: number }[];
}

export async function getPurchaseFunnel(params?: {
  dateFrom?: string;
  dateTo?: string;
  device?: string;
}): Promise<PurchaseFunnelResponse> {
  const { data } = await api.get<PurchaseFunnelResponse>('/analytics/ecommerce/funnel', { params });
  return data;
}

// Customers Analytics
export interface Customer {
  id: string;
  name: string;
  email: string;
  segment: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate: string;
  ltv: number;
  status: 'active' | 'at-risk' | 'churned';
}

export interface CustomersAnalyticsResponse {
  kpis: {
    totalCustomers: number;
    prevCustomers: number;
    newCustomers: number;
    avgLTV: number;
    repeatRate: number;
    churnRate: number;
  };
  segments: { name: string; count: number; percentage: number; avgLTV: number }[];
  customers: Customer[];
  growthTrend: { date: string; total: number; new: number; churned: number }[];
  cohortRetention: { month: string; retention: number }[];
  purchaseFrequency: { orders: string; customers: number; percentage: number }[];
  ltvDistribution: { range: string; customers: number }[];
}

export async function getCustomersAnalytics(params?: {
  segment?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}): Promise<CustomersAnalyticsResponse> {
  const { data } = await api.get<CustomersAnalyticsResponse>('/analytics/ecommerce/customers', { params });
  return data;
}

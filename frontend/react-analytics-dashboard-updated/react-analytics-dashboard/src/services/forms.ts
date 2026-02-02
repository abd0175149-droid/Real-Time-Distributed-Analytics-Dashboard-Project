import { api } from './api';

export interface FormStats {
  id: string;
  name: string;
  page: string;
  submissions: number;
  views: number;
  completionRate: number;
  avgCompletionTime: string;
  abandonmentRate: number;
}

export interface FormField {
  name: string;
  type: string;
  interactions: number;
  dropoffRate: number;
  avgTimeSpent: string;
  errorRate: number;
}

export interface FormsAnalyticsResponse {
  kpis: {
    totalSubmissions: number;
    prevSubmissions: number;
    avgCompletionRate: number;
    prevCompletionRate: number;
    avgCompletionTime: string;
    abandonmentRate: number;
  };
  forms: FormStats[];
  submissionsTrend: { date: string; submissions: number; views: number; completions: number }[];
  fieldAnalysis: FormField[];
  abandonmentReasons: { reason: string; percentage: number }[];
  formPerformance: {
    formId: string;
    formName: string;
    conversion: number;
    avgTime: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

export async function getFormsAnalytics(params?: {
  formId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<FormsAnalyticsResponse> {
  const { data } = await api.get<FormsAnalyticsResponse>('/analytics/forms', { params });
  return data;
}

export async function getFormDetails(formId: string): Promise<FormStats & {
  fields: FormField[];
  trend: { date: string; submissions: number; completionRate: number }[];
}> {
  const { data } = await api.get(`/analytics/forms/${formId}`);
  return data;
}

import { api } from './api';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'overview' | 'traffic' | 'ecommerce' | 'content' | 'custom';
  metrics: string[];
}

export interface ScheduledReport {
  id: string;
  name: string;
  template: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'pdf' | 'csv' | 'excel';
  lastSent: string;
  nextSend: string;
  status: 'active' | 'paused';
}

export interface ExportHistory {
  id: string;
  name: string;
  type: string;
  format: string;
  createdAt: string;
  size: string;
  downloadUrl: string;
}

export interface ReportsResponse {
  templates: ReportTemplate[];
  scheduledReports: ScheduledReport[];
  recentExports: ExportHistory[];
}

export async function getReports(): Promise<ReportsResponse> {
  const { data } = await api.get<ReportsResponse>('/reports');
  return data;
}

export async function createScheduledReport(data: {
  name: string;
  templateId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'pdf' | 'csv' | 'excel';
}): Promise<ScheduledReport> {
  const response = await api.post('/reports/scheduled', data);
  return response.data;
}

export async function updateScheduledReport(
  reportId: string,
  data: Partial<{
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'csv' | 'excel';
    status: 'active' | 'paused';
  }>
): Promise<ScheduledReport> {
  const response = await api.put(`/reports/scheduled/${reportId}`, data);
  return response.data;
}

export async function deleteScheduledReport(reportId: string): Promise<void> {
  await api.delete(`/reports/scheduled/${reportId}`);
}

export async function generateReport(params: {
  templateId: string;
  dateFrom: string;
  dateTo: string;
  format: 'pdf' | 'csv' | 'excel';
}): Promise<{ downloadUrl: string }> {
  const { data } = await api.post('/reports/generate', params);
  return data;
}

export async function exportData(params: {
  type: string;
  dateFrom: string;
  dateTo: string;
  format: 'csv' | 'excel' | 'json';
  metrics?: string[];
}): Promise<{ downloadUrl: string }> {
  const { data } = await api.post('/reports/export', params);
  return data;
}

import { api } from './api';

export interface ApiUser {
  id: string;
  name?: string;
  email?: string;
  created_at?: string;
  location?: string;
  eventsCount?: number;
  lastActive?: string;
}

export async function listUsers(): Promise<ApiUser[]> {
  const { data } = await api.get<ApiUser[]>('/users');
  return data;
}

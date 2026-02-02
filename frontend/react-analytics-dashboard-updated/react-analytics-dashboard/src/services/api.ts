import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// API URL from environment variable - defaults to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Track endpoint URL - used for integration guide (same origin or CORS-enabled)
export const TRACK_ENDPOINT_URL = API_URL + '/track';

// WebSocket URL for real-time updates
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
export const REVERB_APP_KEY = import.meta.env.VITE_REVERB_APP_KEY || 'my-app-key';

// Log warning if using default URLs in production
if (import.meta.env.PROD && API_URL.includes('localhost')) {
  console.warn('Warning: Using localhost API URL in production. Set VITE_API_URL environment variable.');
}

export const tokenStore = {
  get: () => localStorage.getItem('access_token'),
  set: (t: string) => localStorage.setItem('access_token', t),
  clear: () => localStorage.removeItem('access_token'),
};

// User data store
export const userStore = {
  get: () => {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  },
  set: (user: any) => localStorage.setItem('user_data', JSON.stringify(user)),
  clear: () => localStorage.removeItem('user_data'),
};

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshQueue.push(cb);
}

function onRefreshed(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = tokenStore.get();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const original = error.config as any;

      if (status === 401 && !original?._retry) {
        // try refresh once
        original._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token) => {
              if (!token) return reject(error);
              original.headers.Authorization = `Bearer ${token}`;
              resolve(client.request(original));
            });
          });
        }

        isRefreshing = true;
        try {
          const resp = await axios.post(`${API_URL}/refresh`, {}, {
            headers: tokenStore.get() ? { Authorization: `Bearer ${tokenStore.get()}` } : {},
          });
          const newToken = (resp.data as any)?.access_token || (resp.data as any)?.token;
          if (newToken) {
            tokenStore.set(newToken);
            onRefreshed(newToken);
            original.headers.Authorization = `Bearer ${newToken}`;
            return client.request(original);
          }
          tokenStore.clear();
          onRefreshed(null);
          return Promise.reject(error);
        } catch (e) {
          tokenStore.clear();
          onRefreshed(null);
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export const api = createApiClient();

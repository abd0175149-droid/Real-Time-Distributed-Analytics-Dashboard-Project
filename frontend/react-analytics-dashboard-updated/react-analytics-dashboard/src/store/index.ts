import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  UserPreferences, 
  WebsiteType, 
  Theme, 
  DateRange,
  Widget,
  DashboardLayout,
  SidebarConfig 
} from '../types';

// Default widgets for each website type
const defaultWidgetsForType = (type: WebsiteType): Widget[] => {
  const coreWidgets: Widget[] = [
    { id: 'visitors', type: 'kpi', title: 'Visitors', size: 'sm', visible: true, position: 0 },
    { id: 'sessions', type: 'kpi', title: 'Sessions', size: 'sm', visible: true, position: 1 },
    { id: 'bounce-rate', type: 'kpi', title: 'Bounce Rate', size: 'sm', visible: true, position: 2 },
    { id: 'avg-duration', type: 'kpi', title: 'Avg. Duration', size: 'sm', visible: true, position: 3 },
    { id: 'traffic-chart', type: 'line-chart', title: 'Traffic Over Time', size: 'lg', visible: true, position: 4 },
    { id: 'top-pages', type: 'table', title: 'Top Pages', size: 'md', visible: true, position: 5 },
    { id: 'devices', type: 'pie-chart', title: 'Devices', size: 'sm', visible: true, position: 6 },
    { id: 'geo-map', type: 'map', title: 'Geography', size: 'md', visible: true, position: 7 },
  ];

  const typeSpecificWidgets: Record<WebsiteType, Widget[]> = {
    ecommerce: [
      { id: 'revenue', type: 'kpi', title: 'Revenue', size: 'sm', visible: true, position: 8 },
      { id: 'orders', type: 'kpi', title: 'Orders', size: 'sm', visible: true, position: 9 },
      { id: 'aov', type: 'kpi', title: 'Avg. Order Value', size: 'sm', visible: true, position: 10 },
      { id: 'conversion-funnel', type: 'funnel', title: 'Conversion Funnel', size: 'md', visible: true, position: 11 },
      { id: 'top-products', type: 'table', title: 'Top Products', size: 'md', visible: true, position: 12 },
    ],
    blog: [
      { id: 'articles-read', type: 'kpi', title: 'Articles Read', size: 'sm', visible: true, position: 8 },
      { id: 'avg-read-time', type: 'kpi', title: 'Avg. Read Time', size: 'sm', visible: true, position: 9 },
      { id: 'scroll-depth', type: 'kpi', title: 'Scroll Depth', size: 'sm', visible: true, position: 10 },
      { id: 'top-articles', type: 'table', title: 'Top Articles', size: 'lg', visible: true, position: 11 },
    ],
    saas: [
      { id: 'signups', type: 'kpi', title: 'Signups', size: 'sm', visible: true, position: 8 },
      { id: 'conversion-rate', type: 'kpi', title: 'Conversion Rate', size: 'sm', visible: true, position: 9 },
      { id: 'retention', type: 'kpi', title: 'Retention Rate', size: 'sm', visible: true, position: 10 },
      { id: 'signups-chart', type: 'line-chart', title: 'Signups Over Time', size: 'md', visible: true, position: 11 },
      { id: 'feature-usage', type: 'bar-chart', title: 'Feature Usage', size: 'md', visible: true, position: 12 },
    ],
    landing: [
      { id: 'conversions', type: 'kpi', title: 'Conversions', size: 'sm', visible: true, position: 8 },
      { id: 'conv-rate', type: 'kpi', title: 'Conversion Rate', size: 'sm', visible: true, position: 9 },
      { id: 'form-submissions', type: 'kpi', title: 'Form Submissions', size: 'sm', visible: true, position: 10 },
      { id: 'cta-clicks', type: 'bar-chart', title: 'CTA Clicks', size: 'md', visible: true, position: 11 },
    ],
    portfolio: [
      { id: 'project-views', type: 'kpi', title: 'Project Views', size: 'sm', visible: true, position: 8 },
      { id: 'contact-clicks', type: 'kpi', title: 'Contact Clicks', size: 'sm', visible: true, position: 9 },
      { id: 'downloads', type: 'kpi', title: 'Downloads', size: 'sm', visible: true, position: 10 },
    ],
    news: [
      { id: 'articles-today', type: 'kpi', title: 'Articles Today', size: 'sm', visible: true, position: 8 },
      { id: 'trending', type: 'table', title: 'Trending Now', size: 'md', visible: true, position: 9 },
      { id: 'social-shares', type: 'kpi', title: 'Social Shares', size: 'sm', visible: true, position: 10 },
    ],
    custom: [],
  };

  return [...coreWidgets, ...(typeSpecificWidgets[type] || [])];
};

// Default sidebar sections for each website type
const defaultSidebarForType = (type: WebsiteType): string[] => {
  const hiddenSections: Record<WebsiteType, string[]> = {
    ecommerce: ['content', 'saas'],
    blog: ['ecommerce', 'saas'],
    saas: ['ecommerce', 'content'],
    landing: ['ecommerce', 'content', 'saas', 'videos'],
    portfolio: ['ecommerce', 'content', 'saas', 'forms'],
    news: ['ecommerce', 'saas'],
    custom: [],
  };
  return hiddenSections[type] || [];
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

interface PreferencesState {
  preferences: UserPreferences;
  setWebsiteType: (type: WebsiteType) => void;
  setTheme: (theme: Theme) => void;
  setDateRange: (range: DateRange) => void;
  updateDashboardLayout: (layout: Partial<DashboardLayout>) => void;
  updateSidebarConfig: (config: Partial<SidebarConfig>) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  reorderWidgets: (widgets: Widget[]) => void;
  resetToDefaults: () => void;
}

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

// Preferences Store
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: {
        websiteType: 'ecommerce',
        dashboardLayout: {
          widgets: defaultWidgetsForType('ecommerce'),
          order: defaultWidgetsForType('ecommerce').map(w => w.id),
          sizes: {},
        },
        sidebarSections: {
          hidden: defaultSidebarForType('ecommerce'),
          customOrder: [],
        },
        defaultDateRange: '7d',
        theme: 'system',
      },
      setWebsiteType: (type) => {
        set({
          preferences: {
            ...get().preferences,
            websiteType: type,
            dashboardLayout: {
              widgets: defaultWidgetsForType(type),
              order: defaultWidgetsForType(type).map(w => w.id),
              sizes: {},
            },
            sidebarSections: {
              hidden: defaultSidebarForType(type),
              customOrder: [],
            },
          },
        });
      },
      setTheme: (theme) => set({
        preferences: { ...get().preferences, theme },
      }),
      setDateRange: (range) => set({
        preferences: { ...get().preferences, defaultDateRange: range },
      }),
      updateDashboardLayout: (layout) => set({
        preferences: {
          ...get().preferences,
          dashboardLayout: { ...get().preferences.dashboardLayout, ...layout },
        },
      }),
      updateSidebarConfig: (config) => set({
        preferences: {
          ...get().preferences,
          sidebarSections: { ...get().preferences.sidebarSections, ...config },
        },
      }),
      toggleWidgetVisibility: (widgetId) => {
        const widgets = get().preferences.dashboardLayout.widgets.map(w =>
          w.id === widgetId ? { ...w, visible: !w.visible } : w
        );
        set({
          preferences: {
            ...get().preferences,
            dashboardLayout: { ...get().preferences.dashboardLayout, widgets },
          },
        });
      },
      reorderWidgets: (widgets) => set({
        preferences: {
          ...get().preferences,
          dashboardLayout: {
            ...get().preferences.dashboardLayout,
            widgets,
            order: widgets.map(w => w.id),
          },
        },
      }),
      resetToDefaults: () => {
        const type = get().preferences.websiteType;
        set({
          preferences: {
            ...get().preferences,
            dashboardLayout: {
              widgets: defaultWidgetsForType(type),
              order: defaultWidgetsForType(type).map(w => w.id),
              sizes: {},
            },
            sidebarSections: {
              hidden: defaultSidebarForType(type),
              customOrder: [],
            },
          },
        });
      },
    }),
    {
      name: 'preferences-storage',
    }
  )
);

// UI Store
export const useUIStore = create<UIState>()((set, get) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
  toggleMobileSidebar: () => set({ sidebarMobileOpen: !get().sidebarMobileOpen }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));

// Theme hook
export const useTheme = () => {
  const { preferences, setTheme } = usePreferencesStore();
  
  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  };

  return {
    theme: preferences.theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
      applyTheme(theme);
    },
    applyTheme,
  };
};

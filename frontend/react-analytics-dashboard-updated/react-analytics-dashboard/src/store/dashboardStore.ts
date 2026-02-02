import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  description?: string;
  size: 'small' | 'medium' | 'large' | 'full';
  visible: boolean;
  category: string;
  order: number;
}

interface DashboardLayout {
  widgets: WidgetConfig[];
  lastModified: string;
}

interface DashboardState {
  layouts: Record<string, DashboardLayout>;
  activeLayout: string;
  isCustomizing: boolean;
  
  // Actions
  setLayout: (pageId: string, widgets: WidgetConfig[]) => void;
  getLayout: (pageId: string) => WidgetConfig[];
  setActiveLayout: (pageId: string) => void;
  setCustomizing: (isCustomizing: boolean) => void;
  resetLayout: (pageId: string) => void;
  updateWidget: (pageId: string, widgetId: string, updates: Partial<WidgetConfig>) => void;
  addWidget: (pageId: string, widget: WidgetConfig) => void;
  removeWidget: (pageId: string, widgetId: string) => void;
  reorderWidgets: (pageId: string, widgets: WidgetConfig[]) => void;
}

// Default widgets for the overview page
const defaultOverviewWidgets: WidgetConfig[] = [
  { id: 'visitors-kpi', type: 'kpi-visitors', title: 'إجمالي الزوار', size: 'small', visible: true, category: 'نظرة عامة', order: 0 },
  { id: 'pageviews-kpi', type: 'kpi-pageviews', title: 'مشاهدات الصفحات', size: 'small', visible: true, category: 'نظرة عامة', order: 1 },
  { id: 'bounce-kpi', type: 'kpi-bounce-rate', title: 'معدل الارتداد', size: 'small', visible: true, category: 'نظرة عامة', order: 2 },
  { id: 'duration-kpi', type: 'kpi-session-duration', title: 'متوسط الجلسة', size: 'small', visible: true, category: 'نظرة عامة', order: 3 },
  { id: 'traffic-trend', type: 'traffic-trend', title: 'اتجاه الزيارات', size: 'large', visible: true, category: 'نظرة عامة', order: 4 },
  { id: 'devices-chart', type: 'devices-breakdown', title: 'توزيع الأجهزة', size: 'medium', visible: true, category: 'الجمهور', order: 5 },
  { id: 'top-pages', type: 'top-pages', title: 'أكثر الصفحات زيارة', size: 'medium', visible: true, category: 'السلوك', order: 6 },
  { id: 'sources-chart', type: 'traffic-sources', title: 'مصادر الزيارات', size: 'medium', visible: true, category: 'الجمهور', order: 7 },
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      layouts: {
        overview: {
          widgets: defaultOverviewWidgets,
          lastModified: new Date().toISOString(),
        },
      },
      activeLayout: 'overview',
      isCustomizing: false,

      setLayout: (pageId, widgets) => {
        set((state) => ({
          layouts: {
            ...state.layouts,
            [pageId]: {
              widgets: widgets.map((w, i) => ({ ...w, order: i })),
              lastModified: new Date().toISOString(),
            },
          },
        }));
      },

      getLayout: (pageId) => {
        const layout = get().layouts[pageId];
        if (!layout) {
          return pageId === 'overview' ? defaultOverviewWidgets : [];
        }
        return layout.widgets.sort((a, b) => a.order - b.order);
      },

      setActiveLayout: (pageId) => {
        set({ activeLayout: pageId });
      },

      setCustomizing: (isCustomizing) => {
        set({ isCustomizing });
      },

      resetLayout: (pageId) => {
        set((state) => ({
          layouts: {
            ...state.layouts,
            [pageId]: {
              widgets: pageId === 'overview' ? defaultOverviewWidgets : [],
              lastModified: new Date().toISOString(),
            },
          },
        }));
      },

      updateWidget: (pageId, widgetId, updates) => {
        set((state) => {
          const layout = state.layouts[pageId];
          if (!layout) return state;

          return {
            layouts: {
              ...state.layouts,
              [pageId]: {
                ...layout,
                widgets: layout.widgets.map((w) =>
                  w.id === widgetId ? { ...w, ...updates } : w
                ),
                lastModified: new Date().toISOString(),
              },
            },
          };
        });
      },

      addWidget: (pageId, widget) => {
        set((state) => {
          const layout = state.layouts[pageId] || { widgets: [], lastModified: '' };
          const maxOrder = Math.max(...layout.widgets.map((w) => w.order), -1);

          return {
            layouts: {
              ...state.layouts,
              [pageId]: {
                widgets: [...layout.widgets, { ...widget, order: maxOrder + 1 }],
                lastModified: new Date().toISOString(),
              },
            },
          };
        });
      },

      removeWidget: (pageId, widgetId) => {
        set((state) => {
          const layout = state.layouts[pageId];
          if (!layout) return state;

          return {
            layouts: {
              ...state.layouts,
              [pageId]: {
                widgets: layout.widgets.filter((w) => w.id !== widgetId),
                lastModified: new Date().toISOString(),
              },
            },
          };
        });
      },

      reorderWidgets: (pageId, widgets) => {
        set((state) => ({
          layouts: {
            ...state.layouts,
            [pageId]: {
              widgets: widgets.map((w, i) => ({ ...w, order: i })),
              lastModified: new Date().toISOString(),
            },
          },
        }));
      },
    }),
    {
      name: 'dashboard-layout-storage',
    }
  )
);

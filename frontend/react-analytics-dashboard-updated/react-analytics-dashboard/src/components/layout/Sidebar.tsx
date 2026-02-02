import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { usePreferencesStore, useUIStore } from '../../store';
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  FileText,
  Users,
  Monitor,
  Globe,
  Link2,
  MousePointer,
  Flame,
  GitBranch,
  FormInput,
  ShoppingCart,
  Package,
  Newspaper,
  BookOpen,
  UserPlus,
  Repeat,
  Layers,
  Video,
  FileBarChart,
  Settings,
  Code,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import type { WebsiteType } from '../../types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
  badge?: string;
}

const getCoreNavItems = (): NavItem[] => [
  { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Real-Time', path: '/dashboard/realtime', icon: <Activity className="w-5 h-5" />, badge: 'LIVE' },
  { label: 'Traffic', path: '/dashboard/traffic', icon: <TrendingUp className="w-5 h-5" />, section: 'Analytics' },
  { label: 'Pages', path: '/dashboard/pages', icon: <FileText className="w-5 h-5" /> },
];

const getAudienceNavItems = (): NavItem[] => [
  { label: 'Devices', path: '/dashboard/audience/devices', icon: <Monitor className="w-5 h-5" />, section: 'Audience' },
  { label: 'Geography', path: '/dashboard/audience/geography', icon: <Globe className="w-5 h-5" /> },
  { label: 'Sources', path: '/dashboard/audience/sources', icon: <Link2 className="w-5 h-5" /> },
];

const getBehaviorNavItems = (): NavItem[] => [
  { label: 'Interactions', path: '/dashboard/behavior/interactions', icon: <MousePointer className="w-5 h-5" />, section: 'Behavior' },
  { label: 'Heatmaps', path: '/dashboard/behavior/heatmaps', icon: <Flame className="w-5 h-5" /> },
  { label: 'Funnels', path: '/dashboard/behavior/funnels', icon: <GitBranch className="w-5 h-5" /> },
];

const getFormsNavItem = (): NavItem => ({
  label: 'Forms',
  path: '/dashboard/forms',
  icon: <FormInput className="w-5 h-5" />,
});

const getEcommerceNavItems = (): NavItem[] => [
  { label: 'Overview', path: '/dashboard/ecommerce', icon: <ShoppingCart className="w-5 h-5" />, section: 'E-commerce' },
  { label: 'Products', path: '/dashboard/ecommerce/products', icon: <Package className="w-5 h-5" /> },
  { label: 'Funnel', path: '/dashboard/ecommerce/funnel', icon: <GitBranch className="w-5 h-5" /> },
  { label: 'Customers', path: '/dashboard/ecommerce/customers', icon: <Users className="w-5 h-5" /> },
];

const getContentNavItems = (): NavItem[] => [
  { label: 'Articles', path: '/dashboard/content/articles', icon: <BookOpen className="w-5 h-5" />, section: 'Content' },
  { label: 'Engagement', path: '/dashboard/content/engagement', icon: <Newspaper className="w-5 h-5" /> },
];

const getSaasNavItems = (): NavItem[] => [
  { label: 'Signups', path: '/dashboard/saas/signups', icon: <UserPlus className="w-5 h-5" />, section: 'SaaS' },
  { label: 'Retention', path: '/dashboard/saas/retention', icon: <Repeat className="w-5 h-5" /> },
  { label: 'Features', path: '/dashboard/saas/features', icon: <Layers className="w-5 h-5" /> },
];

const getBottomNavItems = (): NavItem[] => [
  { label: 'Videos', path: '/dashboard/videos', icon: <Video className="w-5 h-5" /> },
  { label: 'Reports', path: '/dashboard/reports', icon: <FileBarChart className="w-5 h-5" /> },
  { label: 'Settings', path: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  { label: 'Integration', path: '/dashboard/integration', icon: <Code className="w-5 h-5" /> },
];

const getNavItemsForType = (websiteType: WebsiteType, hiddenSections: string[]): NavItem[] => {
  const items: NavItem[] = [...getCoreNavItems()];
  
  if (!hiddenSections.includes('audience')) {
    items.push(...getAudienceNavItems());
  }
  
  if (!hiddenSections.includes('behavior')) {
    items.push(...getBehaviorNavItems());
  }
  
  if (!hiddenSections.includes('forms')) {
    items.push(getFormsNavItem());
  }
  
  // Type-specific sections
  if (websiteType === 'ecommerce' && !hiddenSections.includes('ecommerce')) {
    items.push(...getEcommerceNavItems());
  }
  
  if ((websiteType === 'blog' || websiteType === 'news') && !hiddenSections.includes('content')) {
    items.push(...getContentNavItems());
  }
  
  if (websiteType === 'saas' && !hiddenSections.includes('saas')) {
    items.push(...getSaasNavItems());
  }
  
  // Bottom items (always shown unless hidden)
  if (!hiddenSections.includes('videos')) {
    items.push(getBottomNavItems()[0]);
  }
  items.push(...getBottomNavItems().slice(1));
  
  return items;
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { preferences } = usePreferencesStore();
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, toggleMobileSidebar } = useUIStore();
  
  const navItems = getNavItemsForType(
    preferences.websiteType,
    preferences.sidebarSections.hidden
  );
  
  let currentSection = '';
  
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-card rounded-lg shadow-lg"
        onClick={toggleMobileSidebar}
      >
        {sidebarMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!sidebarCollapsed && (
            <span className="text-xl font-bold text-primary">Analytics</span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-accent hidden lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item, index) => {
            const showSection = item.section && item.section !== currentSection;
            if (item.section) currentSection = item.section;
            
            return (
              <React.Fragment key={item.path}>
                {showSection && !sidebarCollapsed && (
                  <div className="pt-4 pb-2 px-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {item.section}
                    </span>
                  </div>
                )}
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    cn(
                      "sidebar-item",
                      isActive && "active",
                      sidebarCollapsed && "justify-center px-2"
                    )
                  }
                  onClick={() => sidebarMobileOpen && toggleMobileSidebar()}
                >
                  {item.icon}
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </React.Fragment>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

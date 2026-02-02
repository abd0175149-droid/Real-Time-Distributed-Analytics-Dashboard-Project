import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  Settings,
  Menu
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store';

const navItems = [
  { label: 'الرئيسية', path: '/dashboard', icon: LayoutDashboard },
  { label: 'مباشر', path: '/dashboard/realtime', icon: Activity },
  { label: 'الزيارات', path: '/dashboard/traffic', icon: TrendingUp },
  { label: 'الإعدادات', path: '/dashboard/settings', icon: Settings },
  { label: 'المزيد', path: '', icon: Menu, action: 'menu' },
];

export function MobileNavigation() {
  const { toggleMobileSidebar } = useUIStore();

  return (
    <nav className="mobile-nav safe-bottom">
      <div className="mobile-nav-items">
        {navItems.map((item) => {
          if (item.action === 'menu') {
            return (
              <button
                key="menu"
                onClick={toggleMobileSidebar}
                className="mobile-nav-item"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                cn('mobile-nav-item', isActive && 'active')
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNavigation;

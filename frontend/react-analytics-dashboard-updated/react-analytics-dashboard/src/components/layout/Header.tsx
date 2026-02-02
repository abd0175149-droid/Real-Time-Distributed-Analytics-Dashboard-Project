import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { Button } from '../ui/Button';
import { usePreferencesStore, useTheme, useUIStore } from '../../store';
import { useAuth } from '../AuthContext';
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { DateRange, Theme } from '../../types';

interface HeaderProps {
  title?: string;
  showDatePicker?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showDatePicker = true }) => {
  const navigate = useNavigate();
  const { me, logout: authLogout } = useAuth();
  const { preferences, setDateRange } = usePreferencesStore();
  const { theme, setTheme } = useTheme();
  const { sidebarCollapsed } = useUIStore();

  const handleLogout = async () => {
    await authLogout();
    navigate('/login');
  };

  const themeIcons: Record<Theme, React.ReactNode> = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />,
  };

  return (
    <header className="h-16 bg-card border-b px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Date Range Selector */}
        {showDatePicker && (
          <Select
            value={preferences.defaultDateRange}
            onValueChange={(value) => setDateRange(value as DateRange)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Search */}
        <Button variant="ghost" size="icon">
          <Search className="w-5 h-5" />
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="icon">
              {themeIcons[theme]}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[120px] bg-popover rounded-md shadow-lg border p-1 z-50"
              align="end"
            >
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none"
                onClick={() => setTheme('light')}
              >
                <Sun className="w-4 h-4" /> Light
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none"
                onClick={() => setTheme('dark')}
              >
                <Moon className="w-4 h-4" /> Dark
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none"
                onClick={() => setTheme('system')}
              >
                <Monitor className="w-4 h-4" /> System
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {me?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{me?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{me?.email || ''}</p>
              </div>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-popover rounded-md shadow-lg border p-1 z-50"
              align="end"
            >
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none"
                onClick={() => navigate('/dashboard/settings/profile')}
              >
                <User className="w-4 h-4" /> Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none"
                onClick={() => navigate('/dashboard/settings')}
              >
                <Settings className="w-4 h-4" /> Settings
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none"
              >
                <HelpCircle className="w-4 h-4" /> Help
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};

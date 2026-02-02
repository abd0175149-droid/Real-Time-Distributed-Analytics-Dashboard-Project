import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { usePreferencesStore, useAuthStore, useTheme } from '../../store';
import { cn } from '../../lib/utils';
import {
  User,
  Lock,
  Bell,
  Palette,
  LayoutDashboard,
  Users,
  Code,
  Shield,
  Save,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
  ShoppingCart,
  BookOpen,
  Layers,
  Target,
  Briefcase,
  Newspaper,
  Settings as SettingsIcon,
} from 'lucide-react';
import type { WebsiteType, Theme } from '../../types';

type SettingsTab = 'profile' | 'dashboard' | 'appearance' | 'notifications' | 'security' | 'team';

const websiteTypeLabels: Record<WebsiteType, { label: string; icon: React.ReactNode }> = {
  ecommerce: { label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4" /> },
  blog: { label: 'Blog / Content', icon: <BookOpen className="w-4 h-4" /> },
  saas: { label: 'SaaS Application', icon: <Layers className="w-4 h-4" /> },
  landing: { label: 'Landing Page', icon: <Target className="w-4 h-4" /> },
  portfolio: { label: 'Portfolio / Business', icon: <Briefcase className="w-4 h-4" /> },
  news: { label: 'News / Media', icon: <Newspaper className="w-4 h-4" /> },
  custom: { label: 'Custom', icon: <SettingsIcon className="w-4 h-4" /> },
};

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { user } = useAuthStore();
  const { preferences, setWebsiteType, setDateRange, resetToDefaults } = usePreferencesStore();
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <Card className="lg:w-64 shrink-0">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      className="w-full px-3 py-2 rounded-lg border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="w-full px-3 py-2 rounded-lg border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      defaultValue={user?.company_name || ''}
                      className="w-full px-3 py-2 rounded-lg border bg-background"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'dashboard' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Website Type</CardTitle>
                  <CardDescription>
                    Choose the type that best describes your website. This affects which metrics are shown.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(Object.entries(websiteTypeLabels) as [WebsiteType, { label: string; icon: React.ReactNode }][]).map(
                      ([type, { label, icon }]) => (
                        <button
                          key={type}
                          onClick={() => setWebsiteType(type)}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-lg border transition-all",
                            preferences.websiteType === type
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {icon}
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Default Date Range</CardTitle>
                  <CardDescription>Set the default time period for analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={preferences.defaultDateRange}
                    onValueChange={(value) => setDateRange(value as '7d' | '30d' | '90d' | 'custom')}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reset Dashboard</CardTitle>
                  <CardDescription>Reset all widgets and layout to default settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" onClick={resetToDefaults}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose your preferred color theme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {[
                    { value: 'light' as Theme, label: 'Light', icon: <Sun className="w-5 h-5" /> },
                    { value: 'dark' as Theme, label: 'Dark', icon: <Moon className="w-5 h-5" /> },
                    { value: 'system' as Theme, label: 'System', icon: <Monitor className="w-5 h-5" /> },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                        theme === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {option.icon}
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: 'email_alerts', label: 'Email Alerts', description: 'Receive alerts via email' },
                  { id: 'weekly_report', label: 'Weekly Reports', description: 'Get weekly summary emails' },
                  { id: 'traffic_spike', label: 'Traffic Spike Alerts', description: 'Get notified of unusual traffic' },
                  { id: 'goal_completion', label: 'Goal Completion', description: 'Notify when goals are reached' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Change Password</h4>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <input type="password" className="w-full px-3 py-2 rounded-lg border bg-background" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <input type="password" className="w-full px-3 py-2 rounded-lg border bg-background" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm Password</label>
                      <input type="password" className="w-full px-3 py-2 rounded-lg border bg-background" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage who has access to your analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{user?.name || 'User'}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                      Owner
                    </span>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Invite Team Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

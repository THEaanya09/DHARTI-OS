'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Scan,
  Cpu,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  LogOut,
  Menu,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useIntelligence } from '@/contexts/intelligence-context';
import { isProfileComplete } from '@/lib/profile-utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const navIcons = {
  dashboard: LayoutDashboard,
  analyze: Scan,
  predictions: Cpu,
  settings: Settings,
} as const;

const navItems = [
  { key: 'dashboard', href: '/dashboard' },
  { key: 'analyze', href: '/analyze' },
  { key: 'predictions', href: '/predictions' },
  { key: 'settings', href: '/settings' },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { user, profile, logout, loading, loadingMessage } = useAuth();
  const { insights, hasLiveData } = useIntelligence();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = insights
    .filter((i) => i.priority === 'high' || i.priority === 'critical')
    .slice(0, 5)
    .map((insight) => ({
      id: insight.id,
      title: insight.title,
      description: insight.description,
      priority: insight.priority,
      actionLabel: 'Review',
      read: readIds.has(insight.id),
      time: 'Live',
      confidence: `${insight.confidence}%`,
    }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
    toast.success('All decisions marked as read');
  };

  const handleApply = (id: string, actionLabel: string) => {
    setReadIds((prev) => new Set(prev).add(id));
    toast.success(`Successfully applied: ${actionLabel}`);
  };

  useEffect(() => {
    if (!loading && profile && !isProfileComplete(profile)) {
      router.replace('/onboarding');
    }
  }, [loading, profile, router]);

  const awaitingProfile = Boolean(user && profile === null);
  const needsOnboarding = Boolean(profile && !isProfileComplete(profile));

  if (loading || awaitingProfile || needsOnboarding) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-body-sm text-muted-foreground animate-pulse">
          {loadingMessage || (needsOnboarding ? 'Redirecting to onboarding…' : 'Checking session...')}
        </p>
      </div>
    );
  }

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[260px]';

  const SidebarContent = () => (
    <div className="flex h-full flex-col relative bg-sidebar bg-noise">
      {/* Top accent gradient border line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary via-info to-success" />
      
      {/* Logo */}
      <div className={cn('flex items-center border-b border-sidebar-border px-4 h-16', collapsed && 'justify-center')}>
        <Link href="/dashboard" className="transition-transform duration-150 hover:scale-[1.02]">
          <Logo showText={!collapsed} />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = navIcons[item.key as keyof typeof navIcons];
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const itemLabel = t(`nav.${item.key}`);
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? itemLabel : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground hover:translate-x-0.5',
                collapsed && 'justify-center px-0 border-l-0 hover:translate-x-0'
              )}
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              {!collapsed && <span>{itemLabel}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-3 py-4 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 border border-border/40 bg-surface/30">
            <Avatar className="h-8 w-8 ring-1 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-tr from-primary/20 to-info/20 text-primary text-caption font-bold">
                {(profile?.name || 'U').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold truncate text-foreground">{profile?.name || 'User'}</p>
              <p className="text-[10px] text-muted-foreground truncate">{profile?.email || ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm text-sidebar-foreground/70 transition-all hover:bg-destructive/15 hover:text-destructive cursor-pointer',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          {!collapsed && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
          sidebarWidth
        )}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-20 -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm text-muted-foreground hover:text-foreground transition-colors hidden md:flex"
          style={{ left: collapsed ? '60px' : '248px' }}
        >
          <ChevronLeft className={cn('h-3.5 w-3.5 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[260px] bg-sidebar border-r border-sidebar-border md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="flex items-center justify-center p-2 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('common.search')}
                className="w-64 pl-10 bg-surface border-border/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            {/* Notifications Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative cursor-pointer hover:bg-muted/40 rounded-full"
              >
                <Bell className="h-4.5 w-4.5 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                )}
              </Button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Click outside backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 z-50 w-80 md:w-96 rounded-xl border border-border/30 bg-card p-4 shadow-xl select-none"
                    >
                      <div className="flex items-center justify-between border-b border-border/20 pb-2.5 mb-3">
                        <span className="text-body-sm font-semibold text-foreground flex items-center gap-1.5">
                          Critical Decisions
                          {unreadCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold font-mono">
                              {unreadCount}
                            </span>
                          )}
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-[10px] text-muted-foreground hover:text-foreground font-semibold uppercase tracking-wider cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-none">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-caption text-muted-foreground">
                            No active climate decisions
                          </div>
                        ) : (
                          notifications.map((not) => (
                            <div
                              key={not.id}
                              className={cn(
                                "p-3 rounded-lg border border-border/20 transition-all text-body-sm space-y-2",
                                !not.read ? "bg-surface/50 border-primary/20" : "bg-transparent opacity-60"
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className={cn(
                                      "text-[9px] font-bold uppercase tracking-wider",
                                      not.priority === 'critical' ? 'text-destructive' : 'text-primary'
                                    )}>
                                      {not.priority}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground font-mono">{not.time}</span>
                                  </div>
                                  <h4 className="font-semibold text-foreground">{not.title}</h4>
                                </div>
                                {!not.read && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-caption text-muted-foreground leading-relaxed">
                                {not.description}
                              </p>
                              
                              {!not.read && (
                                <div className="pt-1 flex items-center justify-between gap-4">
                                  <span className="text-[10px] text-muted-foreground font-mono">Confidence: {not.confidence}</span>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApply(not.id, not.actionLabel)}
                                    className="h-7 px-3 text-[10px] font-semibold bg-accent hover:bg-accent/80 text-foreground border border-primary/20 rounded-md cursor-pointer shadow-sm"
                                  >
                                    {not.actionLabel}
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <Avatar className="h-8 w-8 md:hidden">
              <AvatarFallback className="bg-primary/10 text-primary text-caption font-bold">RK</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative bg-background bg-noise">
          {/* Farmer Background image overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="/farmer_bg.png"
              alt="Indian Farmer background"
              className="h-full w-full object-cover object-center opacity-[0.15] dark:opacity-[0.12] mix-blend-multiply dark:mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background dark:from-background/30 dark:via-background dark:to-background" />
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

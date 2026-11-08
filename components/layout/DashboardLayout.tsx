import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppContent, AppShell, Topbar } from '../ui/app-shell';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  useSidebar,
} from '../ui/sidebar';
import { SearchInput } from '../ui/search-input';
import { NotificationCenter, type Notice } from '../ui/notification-center';
import { UserMenu } from '../ui/user-menu';
import { ThemeToggle } from '../ui/theme-toggle';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import {
  ActivityIcon,
  CommandKeyIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  PackageIcon,
  PieChartIcon,
  PlusIcon,
  QuoteIcon,
  RefreshIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UsersIcon,
} from '../ui/icons';
import { useApp } from '../../App';
import { VersionsModal } from '../VersionsModal';

const NAV_GROUPS = [
  {
    label: 'Main menu',
    items: [
      { title: 'Dashboard', href: '/', icon: LayoutDashboardIcon },
      { title: 'Orders', href: '/orders', icon: ShoppingBagIcon, badge: '12' },
      { title: 'Quotations', href: '/quotations', icon: QuoteIcon },
      { title: 'Customers', href: '/customers', icon: UsersIcon },
      { title: 'Inventory', href: '/inventory', icon: PackageIcon },
    ],
  },
  {
    label: 'Finance',
    items: [
      { title: 'Financials', href: '/financials', icon: CreditCardIcon },
      { title: 'Reports', href: '/reports', icon: PieChartIcon },
      { title: 'Invoices', href: '/invoices', icon: FileTextIcon },
    ],
  },
  {
    label: 'System',
    items: [
      { title: 'Settings', href: '/settings', icon: SettingsIcon },
      { title: 'Support', href: '/support', icon: LifeBuoyIcon },
    ],
  },
];

const Brand: React.FC = () => {
  const { collapsed } = useSidebar();
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-[13px] font-bold text-primary-foreground">A</span>
      {!collapsed && (
        <span className="truncate text-[15px] font-semibold tracking-tight">
          Aether<span className="font-medium text-muted-foreground">ERP</span>
        </span>
      )}
    </Link>
  );
};

export const DashboardLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { globalSearch, setGlobalSearch, notifications, setNotifications, simulateDemo, clearDemo, isDemoActive } = useApp();
  const [showChangelog, setShowChangelog] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(open => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (href: string) => {
    setCommandOpen(false);
    navigate(href);
  };

  const notices: Notice[] = notifications.map((n) => ({
    id: String(n.id),
    title: n.title,
    body: n.message,
    time: n.time ?? '',
    read: n.read,
  }));

  const onNoticesChange = (next: Notice[]) => {
    const readIds = new Set(next.filter((n) => n.read).map((n) => n.id));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: readIds.has(String(n.id)) })));
  };

  return (
    <>
      <AppShell
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <Brand />
            </SidebarHeader>
            <SidebarContent>
              {NAV_GROUPS.map((group) => (
                <SidebarGroup key={group.label} label={group.label}>
                  {group.items.map((item) => (
                    <SidebarItem
                      key={item.title}
                      icon={<item.icon />}
                      label={item.title}
                      active={pathname === item.href}
                      badge={item.badge}
                      onClick={() => navigate(item.href)}
                    />
                  ))}
                </SidebarGroup>
              ))}
            </SidebarContent>
            <SidebarFooter>
              <SidebarItem
                icon={<FileTextIcon />}
                label="Changelog"
                onClick={() => setShowChangelog(true)}
              />
              <p className="mt-2 hidden px-2.5 text-[11px] text-muted-foreground lg:block">
                AetherERP v1.1.1
              </p>
            </SidebarFooter>
          </Sidebar>
        }
      >
        <Topbar>
          <div className="w-full max-w-sm">
            <SearchInput
              value={globalSearch}
              onValueChange={setGlobalSearch}
              placeholder="Search records, pages…"
              shortcut="/"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Tooltip content="Command palette" shortcut={['⌘', 'K']}>
              <Button variant="ghost" size="icon-sm" onClick={() => setCommandOpen(true)} aria-label="Open command palette">
                <CommandKeyIcon />
              </Button>
            </Tooltip>
            <ThemeToggle />
            <NotificationCenter notices={notices} onChange={onNoticesChange} />
            <Separator orientation="vertical" className="mx-1 h-6" />
            <UserMenu
              name="Alex Rivera"
              email="alex@aether.erp"
              items={[
                { label: 'Settings', onSelect: () => navigate('/settings') },
                { label: 'Support', onSelect: () => navigate('/support') },
              ]}
              onSignOut={() => navigate('/login')}
            />
          </div>
        </Topbar>
        <AppContent>
          <Outlet />
        </AppContent>
      </AppShell>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search pages and actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {NAV_GROUPS.flatMap((group) => group.items).map((item) => (
              <CommandItem key={item.href} value={`${item.title} ${item.href}`} onSelect={() => go(item.href)}>
                <item.icon />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Create">
            <CommandItem value="new order" onSelect={() => go('/orders')}>
              <PlusIcon /> New order
            </CommandItem>
            <CommandItem value="new invoice" onSelect={() => go('/invoices')}>
              <FileTextIcon /> New invoice
            </CommandItem>
            <CommandItem value="new quotation" onSelect={() => go('/quotations')}>
              <QuoteIcon /> New quotation
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Workspace">
            <CommandItem
              value="changelog release notes"
              onSelect={() => {
                setCommandOpen(false);
                setShowChangelog(true);
              }}
            >
              <FileTextIcon /> Open changelog
            </CommandItem>
            {isDemoActive ? (
              <CommandItem
                value="flush demo data"
                onSelect={() => {
                  setCommandOpen(false);
                  clearDemo();
                }}
              >
                <RefreshIcon /> Flush demo data
              </CommandItem>
            ) : (
              <CommandItem
                value="simulate demo data"
                onSelect={() => {
                  setCommandOpen(false);
                  simulateDemo();
                }}
              >
                <ActivityIcon /> Simulate demo data
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <VersionsModal isOpen={showChangelog} onClose={() => setShowChangelog(false)} />
    </>
  );
};

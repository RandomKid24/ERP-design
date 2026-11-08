import React, { useState } from 'react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Avatar } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DataTable, type Column } from '../components/ui/data-table';
import { Timeline } from '../components/ui/timeline';
import {
  BellIcon,
  BugIcon,
  CalendarIcon,
  GlobeIcon,
  HistoryIcon,
  ReceiptIcon,
  RefreshIcon,
  SparkleIcon,
  TagIcon,
  TrendingIcon,
  UserIcon,
} from '../components/ui/icons';

const MOCK_USER = {
  firstName: 'Alex',
  lastName: 'Rivera',
  email: 'alex.rivera@aethererp.com',
  role: 'System Administrator',
  location: 'Austin, TX',
};

interface AuditLog {
  id: string;
  created_at: string;
  employee_name: string;
  action: string;
  entity_type: string;
  details: string;
  entity_id: string;
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', created_at: '2026-06-28T09:15:00Z', employee_name: 'Alex Rivera', action: 'Login', entity_type: 'system', details: 'Successful login from Austin, TX', entity_id: '' },
  { id: '2', created_at: '2026-06-27T14:30:00Z', employee_name: 'Sarah Jenkins', action: 'Create', entity_type: 'order', details: 'Created order ORD-7237 for TechCorp', entity_id: 'ORD-7237' },
  { id: '3', created_at: '2026-06-27T11:20:00Z', employee_name: 'Mark Greene', action: 'Update', entity_type: 'lead', details: 'Updated lead status to Won', entity_id: 'L-1042' },
  { id: '4', created_at: '2026-06-26T16:45:00Z', employee_name: 'Alice Thompson', action: 'Delete', entity_type: 'customer', details: 'Removed customer record ID 5821', entity_id: '5821' },
  { id: '5', created_at: '2026-06-26T10:00:00Z', employee_name: 'Alex Rivera', action: 'Update', entity_type: 'settings', details: 'Changed notification preferences', entity_id: '' },
  { id: '6', created_at: '2026-06-25T08:30:00Z', employee_name: 'System', action: 'Sync', entity_type: 'hrms', details: 'HRMS employee sync completed (12 updated)', entity_id: '' },
  { id: '7', created_at: '2026-06-24T13:15:00Z', employee_name: 'Ellen Ripley', action: 'Create', entity_type: 'quotation', details: 'Created quotation Q-202 for Lead L-1038', entity_id: 'Q-202' },
  { id: '8', created_at: '2026-06-24T09:45:00Z', employee_name: 'John Doe', action: 'Convert', entity_type: 'lead', details: 'Converted lead L-1035 to customer', entity_id: 'C-891' },
];

const MOCK_VERSIONS = [
  {
    version: '1.1.1',
    release_date: 'June 28, 2026',
    sections: [
      { title: 'New Features', items: ['Audit Logs tab in Settings for full activity tracking', 'Version changelog modal accessible from sidebar', 'Expanded dashboard with Team Leaderboard chart'] },
      { title: 'Bug Fixes', items: ['Fixed pagination reset on search', 'Resolved Sidebar active state flicker on route change', 'Corrected breadcrumb overflow on narrow screens'] },
    ],
  },
  {
    version: '1.1.0',
    release_date: 'June 15, 2026',
    sections: [
      { title: 'New Features', items: ['Help Center page with module FAQ accordion', 'Quick-launch cards for User Guide and Getting Started', 'SearchInput component with debounced filtering'] },
      { title: 'Enhancements', items: ['Migrated design system to a token-based theme', 'Unified button variants across all components', 'Card component now supports title/description/actions slots'] },
    ],
  },
  {
    version: '1.0.0',
    release_date: 'June 1, 2026',
    sections: [
      { title: 'Initial Release', items: ['Dashboard with revenue charts and KPI cards', 'Order and Quotation management pages', 'Customer and Inventory management', 'Financial reporting module', 'Settings and Support pages'] },
    ],
  },
];

type SettingsTab = 'Profile' | 'Audit Logs' | 'Versions';

const actionVariant = (action: string) => {
  const value = action.toLowerCase();
  if (value.includes('delete') || value.includes('remove')) return 'danger' as const;
  if (value.includes('create') || value.includes('add') || value.includes('won') || value.includes('convert')) return 'success' as const;
  return 'info' as const;
};

export const SettingsPage: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');
  const [isSaving, setIsSaving] = useState(false);
  const [emailConnected, setEmailConnected] = useState(false);
  const [emailConnectLoading, setEmailConnectLoading] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    orderUpdates: true,
    invoiceReminders: true,
    weeklyDigest: false,
    productNews: false,
  });

  const notificationRows = [
    {
      key: 'orderUpdates' as const,
      icon: <BellIcon className="size-4" />,
      label: 'Order updates',
      description: 'Get notified when an order changes status.',
    },
    {
      key: 'invoiceReminders' as const,
      icon: <ReceiptIcon className="size-4" />,
      label: 'Invoice reminders',
      description: 'Remind me before an invoice becomes overdue.',
    },
    {
      key: 'weeklyDigest' as const,
      icon: <TrendingIcon className="size-4" />,
      label: 'Weekly digest',
      description: 'A Monday summary of revenue and open orders.',
    },
    {
      key: 'productNews' as const,
      icon: <SparkleIcon className="size-4" />,
      label: 'Product news',
      description: 'Occasional updates about new Aether features.',
    },
  ];

  const toggleNotification = (key: keyof typeof notificationPrefs, label: string) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    showToast(`${label} ${notificationPrefs[key] ? 'disabled' : 'enabled'}`, 'info');
  };

  const auditLogColumns: Column<AuditLog>[] = [
    {
      key: 'created_at',
      header: 'Date & time',
      value: (log) => log.created_at,
      sortable: true,
      render: (log) => {
        const date = new Date(log.created_at);
        return (
          <div className="grid gap-0.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {date.toLocaleDateString('en-GB')}
            </span>
            <span className="text-[13px] font-medium">
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      key: 'employee_name',
      header: 'User',
      value: (log) => log.employee_name || 'System',
      sortable: true,
      render: (log) => {
        const name = log.employee_name || 'System';
        return (
          <div className="flex items-center gap-2">
            <Avatar name={name} size="xs" />
            <span className="max-w-[150px] truncate font-medium" title={name}>{name}</span>
          </div>
        );
      },
    },
    {
      key: 'action',
      header: 'Action',
      value: (log) => log.action,
      render: (log) => <Badge variant={actionVariant(log.action)}>{log.action}</Badge>,
    },
    {
      key: 'details',
      header: 'Log details',
      value: (log) => `${log.entity_type} ${log.details} ${log.entity_id}`,
      render: (log) => {
        const entityLabel = log.entity_type ? log.entity_type.split('_').join(' ') : 'system';
        return (
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5 shrink-0 uppercase">{entityLabel}</Badge>
            <span className="text-[13px] leading-normal text-muted-foreground" title={log.details || ''}>
              {log.details || `ID: ${log.entity_id || 'n/a'}`}
            </span>
          </div>
        );
      },
    },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(`${activeTab} preferences updated`);
    }, 800);
  };

  const handleConnectEmail = () => {
    setEmailConnectLoading(true);
    setTimeout(() => {
      setEmailConnected(true);
      setEmailConnectLoading(false);
      showToast('Gmail account connected successfully');
    }, 1200);
  };

  const handleDisconnectEmail = () => {
    setEmailConnected(false);
    showToast('Gmail account disconnected', 'info');
  };

  return (
    <PageLayout
      title={activeTab}
      description="Manage your account, review activity, and track version changes."
      breadcrumbs={[{ label: 'Settings', href: '/settings' }, { label: activeTab }]}
    >
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingsTab)}>
        <TabsList>
          <TabsTrigger value="Profile"><UserIcon /> Profile</TabsTrigger>
          <TabsTrigger value="Audit Logs"><HistoryIcon /> Audit logs</TabsTrigger>
          <TabsTrigger value="Versions"><TagIcon /> Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="Profile">
          <Card>
            <CardHeader>
              <CardTitle>Account profile</CardTitle>
              <CardDescription>Identity, integrations, and access preferences.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="relative shrink-0">
                  <Avatar
                    name={`${MOCK_USER.firstName} ${MOCK_USER.lastName}`}
                    size="xl"
                    shape="square"
                    className="rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => showToast('Avatar upload opened', 'info')}
                    className="absolute inset-0 grid place-items-center rounded-2xl bg-black/60 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 transition-opacity hover:opacity-100"
                  >
                    Update
                  </button>
                </div>

                <div className="grid flex-1 grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
                  <div className="grid gap-1">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Full name</Label>
                    <span className="text-sm font-medium">{MOCK_USER.firstName} {MOCK_USER.lastName}</span>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Email address</Label>
                    <span className="text-sm font-medium">{MOCK_USER.email}</span>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Designation</Label>
                    <span className="text-sm font-medium">{MOCK_USER.role}</span>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</Label>
                    <Badge variant="success" dot className="w-fit">Active</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <h4 className="text-sm font-semibold tracking-tight">Integrations</h4>
                <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl border bg-secondary/60 text-muted-foreground">
                      <GlobeIcon className="size-5" />
                    </span>
                    <div>
                      <div className="text-sm font-medium">Gmail account</div>
                      <div className="text-[13px] text-muted-foreground">Connect to send automated follow-up emails.</div>
                    </div>
                  </div>

                  {emailConnected ? (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-medium text-success">Authenticated</div>
                        <div className="text-xs text-muted-foreground">{MOCK_USER.email}</div>
                      </div>
                      <Button variant="outline" size="xs" onClick={handleDisconnectEmail}>Disconnect</Button>
                    </div>
                  ) : (
                    <Button variant="secondary" size="sm" loading={emailConnectLoading} onClick={handleConnectEmail}>
                      Connect account
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold tracking-tight">Notifications</h4>
                  <span className="text-xs text-muted-foreground">Email and in-app</span>
                </div>
                <div className="divide-y rounded-lg border">
                  {notificationRows.map((row) => (
                    <div key={row.key} className="flex items-center justify-between gap-4 px-4 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg border bg-secondary/60 text-muted-foreground">
                          {row.icon}
                        </span>
                        <div className="min-w-0">
                          <label
                            htmlFor={`pref-${row.key}`}
                            className="block text-sm font-medium"
                          >
                            {row.label}
                          </label>
                          <p className="truncate text-[13px] text-muted-foreground">{row.description}</p>
                        </div>
                      </div>
                      <Switch
                        id={`pref-${row.key}`}
                        checked={notificationPrefs[row.key]}
                        onCheckedChange={() => toggleNotification(row.key, row.label)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium">Permissions sync</div>
                  <div className="text-[13px] text-muted-foreground">Force refresh your access tokens and permissions.</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Permissions synced successfully')}
                >
                  <RefreshIcon /> Clear cache
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('Profile')}>Reset</Button>
                <Button size="sm" loading={isSaving} onClick={handleSave}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Audit Logs">
          <Card>
            <CardHeader>
              <CardTitle>Audit logs</CardTitle>
              <CardDescription>Every action taken across the workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                rows={MOCK_AUDIT_LOGS}
                columns={auditLogColumns}
                rowKey={(log) => log.id}
                pageSize={6}
                filterPlaceholder="Filter by user, action, entity or details…"
                columnMenu
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Versions">
          <Card>
            <CardHeader>
              <CardTitle>Release history</CardTitle>
              <CardDescription>Changelog and version notes for the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline
                items={MOCK_VERSIONS.map((v) => ({
                  title: `v${v.version}`,
                  time: v.release_date,
                  icon: <TagIcon className="size-3.5" />,
                  tone: v.version === MOCK_VERSIONS[0].version ? ('info' as const) : ('default' as const),
                  description: (
                    <div className="grid gap-4">
                      {v.sections.map((section) => (
                        <section key={section.title} className="grid gap-2">
                          <h4 className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
                            {section.title.toLowerCase().includes('bug') ? (
                              <BugIcon className="size-3.5 text-destructive" />
                            ) : section.title.toLowerCase().includes('enhance') ? (
                              <TrendingIcon className="size-3.5 text-info" />
                            ) : (
                              <SparkleIcon className="size-3.5 text-warning" />
                            )}
                            {section.title}
                          </h4>
                          <ul className="grid gap-1.5 pl-5 text-[13px] leading-relaxed text-muted-foreground">
                            {section.items.map((item, i) => (
                              <li key={i} className="list-disc">{item}</li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                  ),
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

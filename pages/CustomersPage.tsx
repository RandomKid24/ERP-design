import React, { useMemo, useState } from 'react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/avatar';
import { SearchInput } from '../components/ui/search-input';
import { Segmented } from '../components/ui/segmented';
import { EmptyState } from '../components/ui/empty-state';
import { ArrowUpRightIcon, BuildingIcon, MoreIcon, ShieldCheckIcon, UserPlusIcon, UsersIcon } from '../components/ui/icons';

const CUSTOMERS = [
  { id: 'CUST-001', name: 'Alice Thompson', role: 'Enterprise Admin', company: 'TechFlow Inc.', email: 'alice@techflow.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: 'CUST-002', name: 'Marcus Aurelius', role: 'Billing Manager', company: 'Rome Logistics', email: 'marcus@rome.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 'CUST-003', name: 'Sven Gali', role: 'Supply Chain Lead', company: 'Global Traders', email: 'sven@global.com', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=sven' },
  { id: 'CUST-004', name: 'Julia Roberts', role: 'HR Director', company: 'Studio Hub', email: 'julia@studio.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=julia' },
  { id: 'CUST-005', name: 'Leon Kennedy', role: 'Security Consultant', company: 'Umbrella Ops', email: 'leon@umbrella.com', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=leon' },
  { id: 'CUST-006', name: 'Ada Wong', role: 'Field Agent', company: 'Cipher', email: 'ada@cipher.net', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=ada' },
  { id: 'CUST-007', name: 'Bruce Wayne', role: 'CEO', company: 'Wayne Enterprises', email: 'bruce@wayne.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=bruce' },
  { id: 'CUST-008', name: 'Tony Stark', role: 'Chief Engineer', company: 'Stark Industries', email: 'tony@stark.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=tony' },
  { id: 'CUST-009', name: 'Clark Kent', role: 'Journalist', company: 'Daily Planet', email: 'clark@dailyplanet.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=clark' },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'Active': return 'success' as const;
    case 'Pending': return 'warning' as const;
    default: return 'danger' as const;
  }
};

export const CustomersPage: React.FC = () => {
  const { showToast, globalSearch, setGlobalSearch, customers: demoCustomers } = useApp();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Inactive'>('All');

  const filteredCustomers = useMemo(() => {
    const combined = [...CUSTOMERS, ...demoCustomers];
    const term = globalSearch.trim().toLowerCase();
    return combined.filter(c => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (!term) return true;
      return (
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.company.toLowerCase().includes(term)
      );
    });
  }, [globalSearch, demoCustomers, statusFilter]);

  const actions = (
    <Button size="sm" onClick={() => showToast('Initializing account setup…', 'info')}>
      <UserPlusIcon /> New client
    </Button>
  );

  return (
    <PageLayout
      title="Customer registry"
      description="Manage enterprise-level client relationships."
      actions={actions}
    >
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={globalSearch}
          onValueChange={setGlobalSearch}
          placeholder="Filter customer records…"
          shortcut="/"
          className="w-full max-w-sm"
        />
        <Segmented
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Active', label: 'Active' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
        />
        <span className="ml-auto text-xs text-muted-foreground">{filteredCustomers.length} clients</span>
      </div>

      {filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} hoverable className="flex flex-col">
              <div className="flex items-start justify-between gap-3 p-5 pb-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={customer.name} src={customer.avatar} size="lg" status={customer.status === 'Active' ? 'online' : customer.status === 'Pending' ? 'away' : 'offline'} />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold leading-tight">{customer.name}</h3>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{customer.id} · {customer.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${customer.name}`}>
                  <MoreIcon />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t px-5 py-4">
                <div className="grid gap-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Organization</p>
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                    <BuildingIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    {customer.company}
                  </p>
                </div>
                <div className="grid justify-items-end gap-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</p>
                  <Badge variant={statusVariant(customer.status)} dot>{customer.status}</Badge>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t px-5 py-3">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheckIcon className="size-3.5 text-success" /> Secure client
                </span>
                <Button variant="link" size="xs" onClick={() => showToast(`Opening portfolio for ${customer.name}`, 'info')}>
                  View portfolio <ArrowUpRightIcon />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<UsersIcon />}
          title="No matching clients"
          description="Try a different name, email or company."
          action={<Button variant="outline" size="sm" onClick={() => setGlobalSearch('')}>Clear search</Button>}
        />
      )}
    </PageLayout>
  );
};

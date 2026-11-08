import React, { useMemo } from 'react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { StatCard } from '../components/ui/stat-card';
import { DataTable, type Column } from '../components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import {
  ArrowRightIcon,
  BoxIcon,
  EditIcon,
  MoreIcon,
  PackageIcon,
  RefreshIcon,
  TriangleAlertIcon,
  WarehouseIcon,
  XCircleIcon,
} from '../components/ui/icons';

interface StockItem {
  sku: string;
  name: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  category: string;
}

const STOCK_DATA: StockItem[] = [
  { sku: 'ERP-001', name: 'Premium ERP License', stock: 120, status: 'In Stock', category: 'Software' },
  { sku: 'CLD-010', name: 'Storage Unit (Basic)', stock: 12, status: 'Low Stock', category: 'Infrastructure' },
  { sku: 'SEC-202', name: 'Encryption Key V2', stock: 450, status: 'In Stock', category: 'Security' },
  { sku: 'SRV-X86', name: 'Baremetal Instance', stock: 0, status: 'Out of Stock', category: 'Infrastructure' },
  { sku: 'API-PRO', name: 'Advanced API Key', stock: 89, status: 'In Stock', category: 'Software' },
  { sku: 'NET-004', name: 'CDN Node (Edge)', stock: 5, status: 'Low Stock', category: 'Infrastructure' },
  { sku: 'LCN-ENT', name: 'Enterprise Seat Pack', stock: 1200, status: 'In Stock', category: 'Software' },
  { sku: 'DB-X1', name: 'Postgres Instance (XL)', stock: 15, status: 'In Stock', category: 'Database' },
  { sku: 'AUTH-V3', name: 'Auth Module V3', stock: 340, status: 'In Stock', category: 'Security' },
];

const statusVariant = (status: StockItem['status']) => {
  switch (status) {
    case 'In Stock': return 'success' as const;
    case 'Low Stock': return 'warning' as const;
    default: return 'danger' as const;
  }
};

export const InventoryPage: React.FC = () => {
  const { showToast, globalSearch } = useApp();

  const filteredStock = useMemo(() => {
    const term = globalSearch.trim().toLowerCase();
    if (!term) return STOCK_DATA;
    return STOCK_DATA.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.sku.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  }, [globalSearch]);

  const stats = useMemo(() => ({
    tracked: STOCK_DATA.length,
    low: STOCK_DATA.filter(i => i.status === 'Low Stock').length,
    out: STOCK_DATA.filter(i => i.status === 'Out of Stock').length,
  }), []);

  const columns: Column<StockItem>[] = [
    {
      key: 'name',
      header: 'Item',
      value: (item) => item.name,
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border bg-secondary/60 text-muted-foreground">
            <BoxIcon className="size-4" />
          </span>
          <div className="grid gap-0.5">
            <span className="font-medium leading-tight">{item.name}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{item.sku}</span>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', value: (item) => item.category, sortable: true },
    {
      key: 'stock',
      header: 'On hand',
      value: (item) => item.stock,
      sortable: true,
      align: 'right',
      render: (item) => <span className="font-medium tabular-nums">{item.stock.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      value: (item) => item.status,
      render: (item) => <Badge variant={statusVariant(item.status)} dot>{item.status}</Badge>,
    },
  ];

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={() => showToast('Generating stock report…', 'info')}>
        <RefreshIcon /> Report
      </Button>
      <Button size="sm" onClick={() => showToast('Opening bulk editor', 'info')}>
        <PackageIcon /> Update stock
      </Button>
    </>
  );

  return (
    <PageLayout
      title="Inventory management"
      description="Real-time tracking of enterprise assets and resources."
      actions={actions}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Tracked SKUs" value={stats.tracked} icon={<WarehouseIcon />} />
        <StatCard label="Low stock" value={stats.low} delta={-12} deltaLabel="restock pending" icon={<TriangleAlertIcon />} />
        <StatCard label="Out of stock" value={stats.out} icon={<XCircleIcon />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <DataTable
            rows={filteredStock}
            columns={columns}
            rowKey={(item) => item.sku}
            pageSize={8}
            filterPlaceholder="Search SKU indices…"
            columnMenu
            onRowClick={(item) => showToast(`Record: ${item.name}`, 'info')}
            rowActions={(item) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${item.sku}`}>
                    <MoreIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onSelect={() => showToast(`Editing ${item.sku}`, 'info')}>
                    <EditIcon /> Edit record
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => showToast(`Restock order drafted for ${item.sku}`)}>
                    <PackageIcon /> Restock
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive onSelect={() => showToast(`${item.sku} archived`, 'error')}>
                    <XCircleIcon /> Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </div>

        <Card className="self-start">
          <CardHeader>
            <div className="mb-1 flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg border border-warning/25 bg-warning/10 text-warning">
                <TriangleAlertIcon className="size-4" />
              </span>
              <Badge variant="warning">Action needed</Badge>
            </div>
            <CardTitle>Operational alert</CardTitle>
            <CardDescription>Procurement threshold detected.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">{stats.low + stats.out} priority SKUs</span> are below the
              safety stock margin and need replenishment.
            </p>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Urgency</span>
                <span className="font-medium text-warning">85%</span>
              </div>
              <Progress value={85} tone="warning" aria-label="Restock urgency" />
            </div>

            <Button className="w-full" onClick={() => showToast('Procurement workflow initiated', 'success')}>
              Start purchase <ArrowRightIcon />
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { KpiStrip } from '../components/ui/kpi-strip';
import { NumberTicker } from '../components/ui/number-ticker';
import { Segmented } from '../components/ui/segmented';
import { DataTable, type Column } from '../components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { DownloadIcon, FilterIcon, MoreIcon, PlusIcon, EyeIcon, FileTextIcon, XCircleIcon } from '../components/ui/icons';

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
  date: string;
}

const INITIAL_ORDERS: Order[] = [
  { id: '#ORD-7231', customer: 'Sarah Jenkins', product: 'Premium ERP Suite', amount: '$1,200.00', status: 'Processing', date: 'Oct 12, 2023' },
  { id: '#ORD-7232', customer: 'Michael Chen', product: 'Cloud Storage 1TB', amount: '$599.00', status: 'Shipped', date: 'Oct 13, 2023' },
  { id: '#ORD-7233', customer: 'Alisha Varma', product: 'Security Bundle', amount: '$850.00', status: 'Delivered', date: 'Oct 14, 2023' },
  { id: '#ORD-7234', customer: 'Robert Fox', product: 'Support Plan Pro', amount: '$2,100.00', status: 'Canceled', date: 'Oct 15, 2023' },
  { id: '#ORD-7235', customer: 'Emma Watson', product: 'API Access Key', amount: '$150.00', status: 'Delivered', date: 'Oct 15, 2023' },
  { id: '#ORD-7236', customer: 'David Bowie', product: 'Integration Kit', amount: '$420.00', status: 'Delivered', date: 'Oct 16, 2023' },
  { id: '#ORD-7237', customer: 'Global Tech Corp', product: 'Enterprise License', amount: '$45,000.00', status: 'Delivered', date: 'Oct 20, 2023' },
  { id: '#ORD-7238', customer: 'Cyberdyne Systems', product: 'AI Core Module', amount: '$82,500.00', status: 'Processing', date: 'Oct 21, 2023' },
  { id: '#ORD-7239', customer: 'Wayne Enterprises', product: 'Security Suite', amount: '$12,400.00', status: 'Shipped', date: 'Oct 22, 2023' },
  { id: '#ORD-7240', customer: 'Stark Industries', product: 'Power Grid OS', amount: '$250,000.00', status: 'Processing', date: 'Oct 23, 2023' },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'Delivered': return 'success' as const;
    case 'Processing': return 'warning' as const;
    case 'Shipped': return 'info' as const;
    default: return 'danger' as const;
  }
};

type OrderFilter = 'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';

export const OrdersPage: React.FC = () => {
  const { showToast, globalSearch, orders: demoOrders } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [customer, setCustomer] = useState('');
  const [product, setProduct] = useState('erp');
  const [statusFilter, setStatusFilter] = useState<OrderFilter>('All');

  const allOrders = useMemo(() => [...INITIAL_ORDERS, ...demoOrders], [demoOrders]);

  const filteredOrders = useMemo(() => {
    const term = globalSearch.trim().toLowerCase();
    return allOrders.filter(order => {
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;
      return (
        order.customer.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term) ||
        order.product.toLowerCase().includes(term)
      );
    });
  }, [globalSearch, allOrders, statusFilter]);

  const stats = useMemo(() => ({
    total: allOrders.length,
    active: allOrders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length,
    delivered: allOrders.filter(o => o.status === 'Delivered').length,
    canceled: allOrders.filter(o => o.status === 'Canceled').length,
  }), [allOrders]);

  const handleDownload = () => {
    setIsDownloading(true);
    showToast('Exporting order manifest…', 'info');
    setTimeout(() => {
      setIsDownloading(false);
      showToast('Order manifest downloaded successfully');
    }, 1500);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Processing new order entry…', 'info');
    setTimeout(() => {
      setIsCreateOpen(false);
      setCustomer('');
      setProduct('erp');
      showToast('Order created successfully');
    }, 1000);
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order',
      value: (order) => order.id,
      sortable: true,
      render: (order) => <span className="font-medium text-primary">{order.id}</span>,
    },
    {
      key: 'customer',
      header: 'Customer',
      value: (order) => order.customer,
      sortable: true,
      render: (order) => <span className="font-medium">{order.customer}</span>,
    },
    { key: 'product', header: 'Product', value: (order) => order.product },
    { key: 'date', header: 'Date', value: (order) => order.date, sortable: true },
    {
      key: 'amount',
      header: 'Value',
      value: (order) => order.amount,
      align: 'right',
      render: (order) => <span className="font-medium tabular-nums">{order.amount}</span>,
    },
    {
      key: 'status',
      header: 'Fulfillment',
      value: (order) => order.status,
      render: (order) => <Badge variant={statusVariant(order.status)} dot>{order.status}</Badge>,
    },
  ];

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={handleDownload} loading={isDownloading} aria-label="Download CSV">
        {!isDownloading && <DownloadIcon />} Export
      </Button>
      <Button variant="outline" size="sm" onClick={() => showToast('Advanced filtering options enabled', 'info')}>
        <FilterIcon /> Filters
      </Button>
      <Button size="sm" onClick={() => setIsCreateOpen(true)}>
        <PlusIcon /> New order
      </Button>
    </>
  );

  return (
    <PageLayout
      title="Order management"
      description="Track and fulfill your enterprise orders with real-time accuracy."
      actions={actions}
    >
      <KpiStrip
        items={[
          { label: 'Total orders', value: <NumberTicker value={stats.total} countUp />, hint: 'this quarter' },
          { label: 'In fulfillment', value: <NumberTicker value={stats.active} countUp />, delta: 6.4, hint: 'vs last week' },
          { label: 'Delivered', value: <NumberTicker value={stats.delivered} countUp />, delta: 12.1, hint: 'vs last week' },
          { label: 'Canceled', value: <NumberTicker value={stats.canceled} countUp />, delta: -1.8, inverse: true, hint: 'vs last week' },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Processing', label: 'Processing' },
            { value: 'Shipped', label: 'Shipped' },
            { value: 'Delivered', label: 'Delivered' },
            { value: 'Canceled', label: 'Canceled' },
          ]}
        />
        <span className="text-xs text-muted-foreground">{filteredOrders.length} orders</span>
      </div>

      <DataTable
        rows={filteredOrders}
        columns={columns}
        rowKey={(order) => order.id}
        pageSize={8}
        filterPlaceholder="Search orders…"
        columnMenu
        onRowClick={(order) => showToast(`Opening record ${order.id}`, 'info')}
        rowActions={(order) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${order.id}`}>
                <MoreIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={() => showToast(`Opening details for ${order.id}`, 'info')}>
                <EyeIcon /> View details
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => showToast(`Invoice for ${order.id} downloaded`)}>
                <FileTextIcon /> Download invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={() => showToast(`${order.id} marked as canceled`, 'error')}>
                <XCircleIcon /> Cancel order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <form onSubmit={handleCreateOrder} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>New order</DialogTitle>
              <DialogDescription>Create a transaction for an existing client.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-1.5">
              <Label htmlFor="order-customer" required>Client identity</Label>
              <Input
                id="order-customer"
                required
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Legal business name"
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Product module</Label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="erp">Premium ERP Suite</SelectItem>
                  <SelectItem value="cloud">Cloud Storage 1TB</SelectItem>
                  <SelectItem value="security">Security Bundle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button size="sm" type="submit">Create order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

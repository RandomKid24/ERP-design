import React, { useMemo } from 'react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { StatCard } from '../components/ui/stat-card';
import { DataTable, type Column } from '../components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Invoice } from '../components/ui/invoice';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import {
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  FilterIcon,
  MoreIcon,
  PlusIcon,
  PrinterIcon,
  SendIcon,
  XCircleIcon,
} from '../components/ui/icons';

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Draft';
}

const INVOICES: Invoice[] = [
  { id: 'INV-2023-001', customer: 'TechFlow Inc.', amount: 12400, date: 'Oct 12, 2023', status: 'Paid' },
  { id: 'INV-2023-002', customer: 'Rome Logistics', amount: 4200, date: 'Oct 15, 2023', status: 'Pending' },
  { id: 'INV-2023-003', customer: 'Global Traders', amount: 8900, date: 'Oct 08, 2023', status: 'Overdue' },
  { id: 'INV-2023-004', customer: 'Studio Hub', amount: 1200, date: 'Oct 18, 2023', status: 'Draft' },
  { id: 'INV-2023-005', customer: 'Umbrella Ops', amount: 24000, date: 'Oct 20, 2023', status: 'Pending' },
  { id: 'INV-2023-006', customer: 'Hooli Corp', amount: 56000, date: 'Oct 22, 2023', status: 'Paid' },
  { id: 'INV-2023-007', customer: 'Pied Piper', amount: 1500, date: 'Oct 23, 2023', status: 'Paid' },
  { id: 'INV-2023-008', customer: 'Initech', amount: 3400, date: 'Oct 24, 2023', status: 'Overdue' },
  { id: 'INV-2023-009', customer: 'Tyrell Corp', amount: 94000, date: 'Oct 25, 2023', status: 'Pending' },
  { id: 'INV-2023-010', customer: 'Weyland-Yutani', amount: 312000, date: 'Oct 26, 2023', status: 'Paid' },
];

const money = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const statusVariant = (status: Invoice['status']) => {
  switch (status) {
    case 'Paid': return 'success' as const;
    case 'Pending': return 'warning' as const;
    case 'Overdue': return 'danger' as const;
    default: return 'default' as const;
  }
};

export const InvoicesPage: React.FC = () => {
  const { showToast, globalSearch } = useApp();
  const [preview, setPreview] = React.useState<Invoice | null>(null);

  const filteredInvoices = useMemo(() => {
    const term = globalSearch.trim().toLowerCase();
    if (!term) return INVOICES;
    return INVOICES.filter(inv =>
      inv.id.toLowerCase().includes(term) ||
      inv.customer.toLowerCase().includes(term) ||
      inv.status.toLowerCase().includes(term)
    );
  }, [globalSearch]);

  const totals = useMemo(() => {
    const paid = INVOICES.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
    const outstanding = INVOICES.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);
    const overdue = INVOICES.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);
    return { paid, outstanding, overdue };
  }, []);

  const columns: Column<Invoice>[] = [
    {
      key: 'id',
      header: 'Invoice',
      value: (inv) => inv.id,
      sortable: true,
      render: (inv) => (
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border bg-secondary/60 text-muted-foreground">
            <FileTextIcon className="size-4" />
          </span>
          <span className="font-medium text-primary">{inv.id}</span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      value: (inv) => inv.customer,
      sortable: true,
      render: (inv) => <span className="font-medium">{inv.customer}</span>,
    },
    { key: 'date', header: 'Issued', value: (inv) => inv.date, sortable: true },
    {
      key: 'amount',
      header: 'Amount',
      value: (inv) => inv.amount,
      sortable: true,
      align: 'right',
      render: (inv) => <span className="font-medium tabular-nums">{money(inv.amount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      value: (inv) => inv.status,
      render: (inv) => <Badge variant={statusVariant(inv.status)} dot>{inv.status}</Badge>,
    },
  ];

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={() => showToast('Exporting invoice register…', 'info')}>
        <DownloadIcon /> Export
      </Button>
      <Button size="sm" onClick={() => showToast('Invoice generator launched', 'info')}>
        <PlusIcon /> New invoice
      </Button>
    </>
  );

  return (
    <PageLayout
      title="Billing & invoices"
      description="Issue and manage enterprise billing documents."
      actions={actions}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Collected" value={money(totals.paid)} delta={8.2} deltaLabel="vs last cycle" icon={<FileTextIcon />} />
        <StatCard label="Outstanding" value={money(totals.outstanding)} delta={-3.4} deltaLabel="vs last cycle" icon={<SendIcon />} />
        <StatCard label="Overdue" value={money(totals.overdue)} delta={1.1} deltaLabel="vs last cycle" icon={<XCircleIcon />} />
      </div>

      <DataTable
        rows={filteredInvoices}
        columns={columns}
        rowKey={(inv) => inv.id}
        pageSize={8}
        filterPlaceholder="Search invoices…"
        columnMenu
        onRowClick={(inv) => setPreview(inv)}
        toolbar={
          <Button variant="outline" size="sm" onClick={() => showToast('Filter menu applied', 'info')}>
            <FilterIcon /> Filter
          </Button>
        }
        rowActions={(inv) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${inv.id}`}>
                <MoreIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={() => setPreview(inv)}>
                <EyeIcon /> Preview
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => showToast(`${inv.id} sent to ${inv.customer}`)}>
                <SendIcon /> Send invoice
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => showToast(`Preparing ${inv.id} for print`, 'info')}>
                <PrinterIcon /> Print
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={() => showToast(`${inv.id} voided`, 'error')}>
                <XCircleIcon /> Void invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto pt-10">
          {preview && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>Invoice {preview.id}</DialogTitle>
                <DialogDescription>Billing document preview for {preview.customer}.</DialogDescription>
              </DialogHeader>

              <Invoice
                number={preview.id}
                status={preview.status === 'Paid' ? 'paid' : preview.status === 'Overdue' ? 'overdue' : 'unpaid'}
                issued={preview.date}
                due="Nov 15, 2023"
                from={{
                  name: 'Aether Systems Inc.',
                  lines: ['500 Congress Ave', 'Austin, TX 78701', 'billing@aethererp.com'],
                }}
                to={{
                  name: preview.customer,
                  lines: ['Accounts Payable', preview.customer.toLowerCase().replace(/[^a-z]/g, '') + '.com'],
                }}
                lines={[
                  {
                    description: 'Enterprise ERP services',
                    qty: 1,
                    price: Math.round((preview.amount / 1.1) * 100) / 100,
                  },
                ]}
                taxRate={0.1}
                currency="USD"
                locale="en-US"
                notes="Payment is due within 30 days of the issue date. Thank you for your business."
                className="border-0 bg-transparent p-0"
              />

              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>Close</Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast(`${preview.id} sent to ${preview.customer}`)}
                >
                  <SendIcon /> Send
                </Button>
                <Button size="sm" onClick={() => showToast(`${preview.id} downloaded`)}>
                  <DownloadIcon /> Download PDF
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

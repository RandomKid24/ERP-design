import React, { useMemo, useState } from 'react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { StatCard } from '../components/ui/stat-card';
import { AreaChart } from '../components/ui/area-chart';
import { NumberTicker } from '../components/ui/number-ticker';
import { Segmented } from '../components/ui/segmented';
import { DataTable, type Column } from '../components/ui/data-table';
import {
  BriefcaseIcon,
  CreditCardIcon,
  DollarSignIcon,
  DownloadIcon,
  TrendingIcon,
} from '../components/ui/icons';

interface LedgerEntry {
  label: string;
  amount: string;
  date: string;
  status: 'Paid' | 'Hold' | 'Pending';
}

const LEDGER_DATA: LedgerEntry[] = [
  { label: 'Cloud Hosting Sub', amount: '-$1,200.00', date: 'Oct 15, 2023', status: 'Paid' },
  { label: 'Client Retention Bonus', amount: '+$5,400.00', date: 'Oct 14, 2023', status: 'Hold' },
  { label: 'Payroll - Dept A', amount: '-$22,500.00', date: 'Oct 12, 2023', status: 'Paid' },
  { label: 'Maintenance Fee', amount: '-$450.00', date: 'Oct 10, 2023', status: 'Paid' },
  { label: 'Global Licensing', amount: '+$12,000.00', date: 'Oct 09, 2023', status: 'Pending' },
  { label: 'Hardware Procurement', amount: '-$8,200.00', date: 'Oct 08, 2023', status: 'Paid' },
  { label: 'Service Contract #A2', amount: '+$3,100.00', date: 'Oct 07, 2023', status: 'Paid' },
  { label: 'Marketing Retainer', amount: '-$2,500.00', date: 'Oct 05, 2023', status: 'Paid' },
  { label: 'Consultancy Retainer', amount: '+$1,800.00', date: 'Oct 04, 2023', status: 'Pending' },
  { label: 'Azure Dynamics (Monthly)', amount: '-$450.00', date: 'Oct 02, 2023', status: 'Paid' },
];

const statusVariant = (status: LedgerEntry['status']) => {
  switch (status) {
    case 'Paid': return 'success' as const;
    case 'Pending': return 'warning' as const;
    default: return 'default' as const;
  }
};

type SeriesView = 'Both' | 'Actual' | 'Predicted';

const ACTUAL = [65, 45, 95, 75, 55, 85, 0];
const PREDICTED = [70, 50, 90, 80, 65, 85, 100];

export const FinancialsPage: React.FC = () => {
  const { showToast, globalSearch } = useApp();
  const [seriesView, setSeriesView] = useState<SeriesView>('Both');

  const handleDownload = () => {
    showToast('Generating fiscal year-end report…', 'info');
    setTimeout(() => showToast('Report generated successfully'), 1500);
  };

  const filteredLedger = useMemo(() => {
    const term = globalSearch.trim().toLowerCase();
    if (!term) return LEDGER_DATA;
    return LEDGER_DATA.filter(item =>
      item.label.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  }, [globalSearch]);

  const columns: Column<LedgerEntry>[] = [
    {
      key: 'label',
      header: 'Description',
      value: (item) => item.label,
      sortable: true,
      render: (item) => <span className="font-medium">{item.label}</span>,
    },
    { key: 'date', header: 'Date', value: (item) => item.date, sortable: true },
    {
      key: 'status',
      header: 'Status',
      value: (item) => item.status,
      render: (item) => <Badge variant={statusVariant(item.status)} dot>{item.status}</Badge>,
    },
    {
      key: 'amount',
      header: 'Amount',
      value: (item) => parseFloat(item.amount.replace(/[^0-9.-]/g, '')),
      sortable: true,
      align: 'right',
      render: (item) => (
        <span className={`font-medium tabular-nums ${item.amount.startsWith('+') ? 'text-success' : ''}`}>
          {item.amount}
        </span>
      ),
    },
  ];

  const actions = (
    <Button size="sm" onClick={handleDownload}>
      <DownloadIcon /> Download report
    </Button>
  );

  return (
    <PageLayout
      title="Financial reporting"
      description="Real-time fiscal monitoring and revenue forecasting modules."
      actions={actions}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Net profit"
          value={<NumberTicker value={142402} prefix="$" countUp />}
          delta={12.5}
          deltaLabel="vs last week"
          icon={<DollarSignIcon />}
        />
        <StatCard
          label="Operating expenses"
          value={<NumberTicker value={45210} prefix="$" countUp />}
          delta={-2.1}
          deltaLabel="efficiency gain"
          icon={<BriefcaseIcon />}
        />
        <StatCard
          label="Credit risk"
          value={<NumberTicker value={12000} prefix="$" countUp />}
          icon={<CreditCardIcon />}
          chart={<TrendingIcon className="size-8 text-warning" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
            <div className="grid gap-1.5">
              <CardTitle>Revenue stream</CardTitle>
              <CardDescription>Q4 predictive analysis vs actual performance.</CardDescription>
            </div>
            <Segmented
              value={seriesView}
              onValueChange={setSeriesView}
              options={[
                { value: 'Both', label: 'Both' },
                { value: 'Actual', label: 'Actual' },
                { value: 'Predicted', label: 'Forecast' },
              ]}
            />
          </CardHeader>
          <CardContent>
            <AreaChart
              labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']}
              series={[
                ...(seriesView !== 'Predicted' ? [{ name: 'Actual', data: ACTUAL }] : []),
                ...(seriesView !== 'Actual'
                  ? [{ name: 'Predicted', data: PREDICTED, color: 'text-muted-foreground' }]
                  : []),
              ]}
              format={(n) => `${n}k`}
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Ledger highlights</CardTitle>
            <CardDescription>Latest verified system entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              rows={filteredLedger}
              columns={columns}
              rowKey={(item) => item.label + item.date}
              pageSize={6}
              filterPlaceholder="Filter ledger entries…"
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

import React, { useMemo } from 'react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DataTable, type Column } from '../components/ui/data-table';
import {
  BarChartIcon,
  ClockIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  PlusIcon,
} from '../components/ui/icons';

interface ReportTemplate {
  name: string;
  type: string;
  size: string;
}

const TEMPLATES: ReportTemplate[] = [
  { name: 'Annual Growth Forecast', type: 'Predictive', size: '2.4 MB' },
  { name: 'Weekly Operational Audit', type: 'Summary', size: '1.1 MB' },
  { name: 'Quarterly Financial Review', type: 'Audit', size: '4.8 MB' },
  { name: 'Regional Perf Matrix', type: 'Compare', size: '3.2 MB' },
  { name: 'Inventory Lifecycle Log', type: 'Logistics', size: '0.8 MB' },
];

const COLLECTIONS = [
  { title: 'Sales Summary', icon: BarChartIcon, count: 24, last: '2h ago' },
  { title: 'Inventory Logs', icon: FileTextIcon, count: 156, last: 'Yesterday' },
  { title: 'User Activity', icon: ClockIcon, count: 12, last: '1h ago' },
  { title: 'Tax Statements', icon: FileSpreadsheetIcon, count: 8, last: '3d ago' },
];

export const ReportsPage: React.FC = () => {
  const { showToast, globalSearch } = useApp();

  const filteredTemplates = useMemo(() => {
    const term = globalSearch.trim().toLowerCase();
    if (!term) return TEMPLATES;
    return TEMPLATES.filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.type.toLowerCase().includes(term)
    );
  }, [globalSearch]);

  const columns: Column<ReportTemplate>[] = [
    {
      key: 'name',
      header: 'Document',
      value: (item) => item.name,
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border bg-secondary/60 text-muted-foreground">
            <FileTextIcon className="size-4" />
          </span>
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Audit type',
      value: (item) => item.type,
      sortable: true,
      render: (item) => <Badge variant="outline">{item.type}</Badge>,
    },
    { key: 'size', header: 'Capacity', value: (item) => item.size, align: 'right' },
  ];

  const actions = (
    <Button size="sm" onClick={() => showToast('Opening report builder', 'info')}>
      <PlusIcon /> New template
    </Button>
  );

  return (
    <PageLayout
      title="Enterprise reports"
      description="Generate and manage comprehensive business insights."
      actions={actions}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COLLECTIONS.map((item) => (
          <Card
            key={item.title}
            hoverable
            className="cursor-pointer p-5"
            onClick={() => showToast(`Opening ${item.title} directory`, 'info')}
          >
            <div className="mb-4 flex items-start justify-between">
              <span className="grid size-9 place-items-center rounded-lg border bg-secondary/60 text-muted-foreground">
                <item.icon className="size-4" />
              </span>
              <ExternalLinkIcon className="size-3.5 text-muted-foreground/50" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight">{item.title}</h3>
            <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.count} reports</span>
              <span>{item.last}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Templates</h3>
            <p className="text-[13px] text-muted-foreground">Predefined auditing structures.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => showToast('Import dialog opened', 'info')}>
            <DownloadIcon /> Import
          </Button>
        </div>
        <div className="p-5">
          <DataTable
            rows={filteredTemplates}
            columns={columns}
            rowKey={(item) => item.name}
            pageSize={6}
            filterPlaceholder="Search report templates…"
            rowActions={(item) => (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Download ${item.name}`}
                onClick={() => showToast(`Downloading ${item.name}`)}
              >
                <DownloadIcon />
              </Button>
            )}
          />
        </div>
      </Card>
    </PageLayout>
  );
};

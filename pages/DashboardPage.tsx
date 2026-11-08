import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { CHART_DATA, DASHBOARD_STATS, RECENT_TRANSACTIONS } from '../constants';
import { PageLayout } from '../components/layout/PageLayout';
import { StatCard } from '../components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { ProgressRing } from '../components/ui/progress-ring';
import { Sparkline } from '../components/ui/charts';
import { LineChart } from '../components/ui/line-chart';
import { BarList } from '../components/ui/bar-list';
import { DataTable, type Column } from '../components/ui/data-table';
import { DownloadIcon, LayoutGridIcon, CheckIcon, ActivityIcon, RefreshIcon, MaximizeIcon } from '../components/ui/icons';
import { WidgetConfig, WidgetId, Transaction } from '../types';

const DEFAULT_LAYOUT: WidgetConfig[] = [
    { id: 'revenue-chart', span: 2 },
    { id: 'goal-chart', span: 1 },
    { id: 'activity-table', span: 2 },
    { id: 'global-reach', span: 1 },
];

const SPARKS = [
    [12, 18, 14, 22, 26, 24, 31],
    [8, 12, 10, 16, 15, 21, 24],
    [10, 9, 14, 13, 18, 22, 25],
    [30, 28, 27, 29, 24, 22, 21],
];

const WIDGET_META: Record<WidgetId, { title: string; description: string }> = {
    'revenue-chart': { title: 'Revenue stream', description: 'Fiscal performance against target.' },
    'goal-chart': { title: 'Goal progress', description: 'Quarterly targets achievement.' },
    'activity-table': { title: 'Recent activity', description: 'Latest verified system events.' },
    'global-reach': { title: 'Global reach', description: 'Operational distribution by region.' },
};

const transactionColumns: Column<Transaction>[] = [
    {
        key: 'customer',
        header: 'Customer',
        value: (row) => row.customer,
        render: (row) => (
            <div className="grid gap-0.5">
                <span className="font-medium">{row.customer}</span>
                <span className="text-xs text-muted-foreground">{row.email}</span>
            </div>
        ),
    },
    {
        key: 'status',
        header: 'Status',
        value: (row) => row.status,
        render: (row) => (
            <Badge variant={row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'} dot>
                {row.status}
            </Badge>
        ),
    },
    { key: 'date', header: 'Date', value: (row) => row.date },
    { key: 'amount', header: 'Amount', value: (row) => row.amount, align: 'right' },
];

export const DashboardPage: React.FC = () => {
    const { showToast, isDemoActive, simulateDemo, clearDemo } = useApp();
    const [isExporting, setIsExporting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [layout, setLayout] = useState<WidgetConfig[]>(() => {
        try {
            const saved = localStorage.getItem('dashboard-layout');
            return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
        } catch (e) {
            return DEFAULT_LAYOUT;
        }
    });

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem('dashboard-layout', JSON.stringify(layout));
    }, [layout]);

    const toggleResize = (id: WidgetId) => {
        setLayout(prev => prev.map(w => {
            if (w.id === id) {
                const nextSpan = (w.span % 3) + 1 as 1 | 2 | 3;
                return { ...w, span: nextSpan };
            }
            return w;
        }));
    };

    const handleDragStart = (index: number) => {
        if (!isEditMode) return;
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleDrop = (index: number) => {
        if (draggedIndex === null) return;
        const newOrder = [...layout];
        const itemToMove = newOrder[draggedIndex];
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(index, 0, itemToMove);
        setLayout(newOrder);
        setDraggedIndex(null);
    };

    const renderBody = (id: WidgetId) => {
        switch (id) {
            case 'revenue-chart':
                return (
                    <LineChart
                        area
                        labels={CHART_DATA.map(d => d.name)}
                        series={[
                            { name: 'Revenue', data: CHART_DATA.map(d => d.revenue) },
                            { name: 'Target', data: CHART_DATA.map(d => d.target), color: 'text-muted-foreground' },
                        ]}
                        format={(n) => `$${(n / 1000).toFixed(1)}k`}
                    />
                );
            case 'goal-chart':
                return (
                    <div className="flex h-full flex-col justify-center gap-5">
                        <div className="flex items-center gap-5">
                            <ProgressRing value={72} size={104} aria-label="Quarterly target achieved">
                                72%
                            </ProgressRing>
                            <div className="grid gap-1">
                                <span className="text-2xl font-semibold tracking-tight tabular-nums">$182k</span>
                                <span className="text-[13px] text-muted-foreground">of $250k target</span>
                            </div>
                        </div>
                        <div className="grid gap-3">
                            {[
                                { label: 'New business', value: 84, tone: 'primary' as const },
                                { label: 'Expansion', value: 61, tone: 'success' as const },
                                { label: 'Renewals', value: 47, tone: 'warning' as const },
                            ].map((item) => (
                                <div key={item.label} className="grid gap-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">{item.label}</span>
                                        <span className="font-medium tabular-nums">{item.value}%</span>
                                    </div>
                                    <Progress value={item.value} tone={item.tone} aria-label={item.label} />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'activity-table':
                return (
                    <DataTable
                        rows={RECENT_TRANSACTIONS}
                        columns={transactionColumns}
                        rowKey={(row) => row.id}
                        pageSize={5}
                        filterPlaceholder="Filter activity…"
                        className="border-0 shadow-none"
                    />
                );
            case 'global-reach':
                return (
                    <BarList
                        items={[
                            { label: 'Americas', value: 75 },
                            { label: 'EMEA', value: 45 },
                            { label: 'APAC', value: 32 },
                            { label: 'LATAM', value: 18 },
                        ]}
                        format={(n) => `${n}%`}
                    />
                );
            default:
                return null;
        }
    };

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            showToast('Enterprise data exported successfully');
        }, 1500);
    };

    const actions = (
        <>
            {isDemoActive ? (
                <Button variant="outline" size="sm" onClick={clearDemo}>
                    <RefreshIcon /> Flush demo
                </Button>
            ) : (
                <Button variant="outline" size="sm" onClick={simulateDemo}>
                    <ActivityIcon /> Simulate demo
                </Button>
            )}
            <Button
                variant={isEditMode ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                    setIsEditMode(!isEditMode);
                    showToast(isEditMode ? 'Dashboard configuration saved' : 'Layout unlocked. Drag cards to rearrange.', isEditMode ? 'success' : 'info');
                }}
            >
                {isEditMode ? <CheckIcon /> : <LayoutGridIcon />}
                {isEditMode ? 'Save layout' : 'Customize'}
            </Button>
            <Button size="sm" onClick={handleExport} loading={isExporting}>
                <DownloadIcon /> Export CSV
            </Button>
        </>
    );

    return (
        <PageLayout
            title="Enterprise overview"
            description="Monitoring real-time operational status and metrics."
            actions={actions}
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {DASHBOARD_STATS.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <StatCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            delta={parseFloat(stat.change.replace(/[^0-9.-]/g, ''))}
                            icon={<Icon />}
                            chart={<Sparkline data={SPARKS[index % SPARKS.length]} className={stat.trend === 'down' ? 'text-destructive' : 'text-success'} />}
                        />
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {layout.map((config, index) => {
                    const span = config.span === 1 ? 'lg:col-span-1' : config.span === 2 ? 'lg:col-span-2' : 'lg:col-span-3';
                    const meta = WIDGET_META[config.id];
                    return (
                        <div
                            key={config.id}
                            draggable={isEditMode}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                            className={`min-w-0 ${span} ${isEditMode ? 'cursor-grab rounded-xl ring-2 ring-dashed ring-border active:cursor-grabbing' : ''}`}
                        >
                            <Card className="h-full">
                                <CardHeader className="flex-row items-start justify-between gap-3">
                                    <div className="grid gap-1">
                                        <CardTitle>{meta.title}</CardTitle>
                                        <CardDescription>{meta.description}</CardDescription>
                                    </div>
                                    {isEditMode && (
                                        <Button variant="ghost" size="icon-sm" onClick={() => toggleResize(config.id)} aria-label="Resize card">
                                            <MaximizeIcon />
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {renderBody(config.id)}
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </PageLayout>
    );
};

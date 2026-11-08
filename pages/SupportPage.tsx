import React, { useMemo, useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';
import { SearchInput } from '../components/ui/search-input';
import { EmptyState } from '../components/ui/empty-state';
import {
  BarChartIcon,
  BookIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayersIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from '../components/ui/icons';

const MODULES = [
  {
    id: 'leads',
    label: 'Leads',
    icon: BriefcaseIcon,
    faqs: [
      { q: 'How do I create a new lead?', a: 'Go to Leads and click "New lead". Link a Contact or Customer, select Domain & Region, choose a number series, fill in Lead type, Lead through (e.g. Cold Calling, Website), and an optional potential value. Click Save — a Lead No. is auto-generated.' },
      { q: 'How do I move a lead through the pipeline?', a: 'In Kanban view, drag the lead card from one status column to another (e.g. New → Quote generated). Won and Lost leads are final. If the target status requires extra info, a form will appear.' },
      { q: 'How do I mark a lead as Won?', a: 'Move the lead to Won in Kanban and enter the Closed value when prompted. The lead becomes final and cannot be dragged further.' },
      { q: 'How do I set a follow-up reminder?', a: 'Open the lead and set the "Next follow-up date" field. Use the Activities (Enquiry log) section to log calls, meetings, and notes — these appear in lead detail and reports.' },
    ],
  },
  {
    id: 'quotations',
    label: 'Quotations',
    icon: FileTextIcon,
    faqs: [
      { q: 'How do I view quotations?', a: 'Click Quotations in the sidebar. You see the list with lead reference, date, and status. Use search or filters if available on the page.' },
      { q: 'How do I create a quotation?', a: 'From Quotations, click "New quotation", or open a lead and add a quotation from there. Select the Lead, fill in quote details (products, amounts, validity), and save.' },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCartIcon,
    faqs: [
      { q: 'How do I create a new order?', a: 'Go to Orders and click "New order". Link it to a Won lead, choose the number series, enter Order value and Region, and save.' },
      { q: 'How do I update an order status?', a: 'In Kanban view, drag the order card to a new status column (e.g. Pending → Drawing Approved). Won and Lost orders are final.' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    icon: UsersIcon,
    faqs: [
      { q: 'How do I add an Organization?', a: 'Go to Database → Organizations, click "New organization", enter Name, Code, Industry and other fields. In the Plants tab add plants with name, code, and address.' },
      { q: 'How do I convert a Contact to a Customer?', a: 'Open the Contact, then use the "Convert to customer" action. This creates a Customer record linked to the same contact.' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChartIcon,
    faqs: [
      { q: 'How do I run a report?', a: 'Click Reports in the sidebar and select the report type. Set your date range, domain, and region.' },
      { q: 'How do I create a custom Report Template?', a: 'Go to Report Templates and click "New report template". Add sections with a Title and a SQL SELECT query.' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    faqs: [
      { q: 'How do I connect my Gmail account?', a: 'Go to Settings → Profile, scroll to Integrations, and click "Connect Account" under Gmail.' },
      { q: 'Where do I manage Numbering Series?', a: 'Go to Settings → Numbering Series (admin only). Configure the prefix and sequence for Lead, Order, and other numbers.' },
    ],
  },
];

const GUIDES = [
  { title: 'Full user guide', icon: BookIcon, desc: 'Complete step-by-step documentation for every module.' },
  { title: 'Getting started', icon: LayersIcon, desc: 'Login, dashboard overview, and first steps.' },
  { title: 'Schema reference', icon: FileTextIcon, desc: 'Table and column reference for custom report templates.' },
];

export const SupportPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({ leads: true });

  const toggle = (key: string) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const filtered = useMemo(() => {
    if (!search.trim()) return MODULES;
    const q = search.toLowerCase();
    return MODULES.map(m => ({
      ...m,
      faqs: m.faqs.filter(f =>
        f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      ),
    })).filter(m => m.faqs.length > 0);
  }, [search]);

  return (
    <PageLayout
      title="Help center"
      description="Find answers and step-by-step guides for every module."
      breadcrumbs={[{ label: 'Support', href: '/support' }]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {GUIDES.map((guide) => (
          <Card key={guide.title} hoverable className="group cursor-pointer p-5">
            <div className="mb-4 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <guide.icon className="size-5" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight">{guide.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{guide.desc}</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary transition-all group-hover:gap-2.5">
              Open guide <ExternalLinkIcon className="size-3" />
            </div>
          </Card>
        ))}
      </div>

      <SearchInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search help articles…"
        shortcut="/"
        className="max-w-md"
      />

      {filtered.length > 0 ? (
        <div className="grid gap-3">
          {filtered.map((module) => {
            const isOpen = !!open[module.id];
            return (
              <div key={module.id} className="overflow-hidden rounded-xl border bg-card">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-secondary/50"
                  onClick={() => toggle(module.id)}
                  aria-expanded={isOpen}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
                    <module.icon className="size-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium">{module.label}</span>
                  <span className="text-xs text-muted-foreground">{module.faqs.length} articles</span>
                  <ChevronDownIcon className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="divide-y border-t">
                    {module.faqs.map((faq, i) => (
                      <div key={i} className="flex items-start gap-3 bg-secondary/20 px-5 py-4">
                        <HelpCircleIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="grid gap-1">
                          <p className="text-[13px] font-medium">{faq.q}</p>
                          <p className="text-[13px] leading-relaxed text-muted-foreground">{faq.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<HelpCircleIcon />}
          title="No articles found"
          description="Try a different search term."
          action={<Button variant="outline" size="sm" onClick={() => setSearch('')}>Clear search</Button>}
        />
      )}

      <Alert variant="info" title="Missing a menu item or action?">
        Your user role may not have the required permission. Contact your administrator to request access.
      </Alert>
    </PageLayout>
  );
};

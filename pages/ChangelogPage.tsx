import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Timeline } from '../components/ui/timeline';
import { TagIcon, BugIcon, SparkleIcon, TrendingIcon } from '../components/ui/icons';

const VERSIONS = [
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

export const ChangelogPage: React.FC = () => {
  return (
    <PageLayout
      title="Changelog"
      description="Release notes and version history for Aether ERP."
      breadcrumbs={[{ label: 'Changelog', href: '/changelog' }]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Version log</CardTitle>
          <CardDescription>What's new, improved, and fixed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Timeline
            items={VERSIONS.map((v) => ({
              title: `v${v.version}`,
              time: v.release_date,
              icon: <TagIcon className="size-3.5" />,
              tone: v.version === VERSIONS[0].version ? ('info' as const) : ('default' as const),
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
    </PageLayout>
  );
};

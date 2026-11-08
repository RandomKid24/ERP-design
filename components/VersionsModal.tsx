import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BugIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon, SparkleIcon } from './ui/icons';

interface ChangelogVersion {
  id: number;
  version: string;
  release_date: string;
  sections: { title: string; items: string[] }[];
}

interface VersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_VERSIONS: ChangelogVersion[] = [
  {
    id: 3,
    version: '1.1.1',
    release_date: 'June 28, 2026',
    sections: [
      { title: 'New Features', items: ['**Audit Logs** tab in Settings for full activity history', '**Version changelog** modal accessible from sidebar', 'Expanded dashboard with **Team Leaderboard** chart'] },
      { title: 'Bug Fixes', items: ['Fixed pagination reset on search in DataTable', 'Resolved `Sidebar` active state flicker on route change', 'Corrected `PageLayout` breadcrumb overflow on narrow screens'] },
    ],
  },
  {
    id: 2,
    version: '1.1.0',
    release_date: 'June 15, 2026',
    sections: [
      { title: 'New Features', items: ['**Help Center** page with module FAQ accordion', 'Quick-launch cards for **User Guide**, **Getting Started**, **Schema Reference**', '`SearchInput` component with debounced filtering'] },
      { title: 'Enhancements', items: ['Migrated design system to the **befui** component library', 'Unified button variants across all `Button` components', '`Card` component now supports header, content and footer slots'] },
    ],
  },
  {
    id: 1,
    version: '1.0.0',
    release_date: 'June 1, 2026',
    sections: [
      { title: 'Initial Release', items: ['Dashboard with revenue charts and KPI cards', 'Order and Quotation management pages', 'Customer and Inventory management', 'Financial reporting module', 'Settings and Support pages'] },
    ],
  },
];

const parseMarkdown = (text: string): React.ReactNode => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="rounded border bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

export const VersionsModal: React.FC<VersionsModalProps> = ({ isOpen, onClose }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedVersions = showAll ? MOCK_VERSIONS : MOCK_VERSIONS.slice(0, 1);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl gap-5">
        <DialogHeader>
          <DialogTitle>What&apos;s new</DialogTitle>
          <DialogDescription>Release history for AetherERP.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-8 overflow-y-auto pr-2">
          {displayedVersions.map((v, idx) => (
            <div key={v.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-2.5">
                <Badge variant="info">Version {v.version}</Badge>
                <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  <CalendarIcon className="size-3" />
                  {v.release_date}
                  {idx === 0 && <Badge variant="outline" className="ml-1">Latest</Badge>}
                </span>
              </div>

              <div className="space-y-5 border-l pl-4">
                {v.sections.map((section) => (
                  <section key={section.title} className="space-y-2">
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      {section.title.toLowerCase().includes('bug') ? (
                        <BugIcon className="size-3.5 text-destructive" />
                      ) : (
                        <SparkleIcon className="size-3.5 text-warning" />
                      )}
                      {section.title}
                    </h4>
                    <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-muted-foreground">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{parseMarkdown(item)}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="items-center justify-between border-t pt-4 sm:justify-between">
          {MOCK_VERSIONS.length > 1 ? (
            <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)}>
              {showAll ? <ChevronUpIcon /> : <ChevronDownIcon />}
              {showAll ? 'Show newest release only' : `Show older releases (${MOCK_VERSIONS.length - 1})`}
            </Button>
          ) : (
            <span />
          )}
          <Button size="sm" onClick={onClose}>Looks good</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import React from 'react';
import { PageHeader } from '../ui/app-shell';
import { Breadcrumb } from '../ui/breadcrumb';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageLayoutProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    title,
    description,
    actions,
    children,
    className = "",
    breadcrumbs
}) => {
    return (
        <div className={`flex w-full flex-col gap-5 ${className}`}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb items={breadcrumbs} />
            )}
            <PageHeader title={title} description={description} actions={actions} className="mb-0" />
            {children}
        </div>
    );
};

import React from 'react';
import {
  LayoutDashboardIcon,
  UsersIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  SettingsIcon,
  PieChartIcon,
  LifeBuoyIcon,
  PackageIcon,
  FileTextIcon,
  QuoteIcon,
} from './components/ui/icons';
import { NavItem, StatItem, Transaction } from './types';

export const SIDEBAR_LINKS: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboardIcon, href: '/' },
  { title: 'Orders', icon: ShoppingBagIcon, href: '/orders', badge: '12' },
  { title: 'Quotations', icon: QuoteIcon, href: '/quotations' },
  { title: 'Customers', icon: UsersIcon, href: '/customers' },
  { title: 'Inventory', icon: PackageIcon, href: '/inventory' },
  { title: 'Financials', icon: CreditCardIcon, href: '/financials' },
  { title: 'Reports', icon: PieChartIcon, href: '/reports' },
  { title: 'Invoices', icon: FileTextIcon, href: '/invoices' },
];

export const SECONDARY_LINKS: NavItem[] = [
  { title: 'Settings', icon: SettingsIcon, href: '/settings' },
  { title: 'Support', icon: LifeBuoyIcon, href: '/support' },
];

export const DASHBOARD_STATS: StatItem[] = [
  {
    label: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1% from last month',
    trend: 'up',
    icon: CreditCardIcon
  },
  {
    label: 'Active Users',
    value: '2,350',
    change: '+180.1% from last month',
    trend: 'up',
    icon: UsersIcon
  },
  {
    label: 'Sales',
    value: '+12,234',
    change: '+19% from last month',
    trend: 'up',
    icon: ShoppingBagIcon
  },
  {
    label: 'Active Inventory',
    value: '573',
    change: '-2.1% from last month',
    trend: 'down',
    icon: PackageIcon
  },
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  { id: '1', customer: 'Liam Johnson', email: 'liam@example.com', amount: '$250.00', status: 'Completed', date: '2023-06-23' },
  { id: '2', customer: 'Olivia Smith', email: 'olivia@example.com', amount: '$150.00', status: 'Pending', date: '2023-06-24' },
  { id: '3', customer: 'Noah Williams', email: 'noah@example.com', amount: '$350.00', status: 'Completed', date: '2023-06-25' },
  { id: '4', customer: 'Emma Brown', email: 'emma@example.com', amount: '$450.00', status: 'Canceled', date: '2023-06-26' },
  { id: '5', customer: 'James Wilson', email: 'james@example.com', amount: '$550.00', status: 'Completed', date: '2023-06-27' },
];

export const CHART_DATA = [
  { name: 'Jan', revenue: 4000, target: 2400 },
  { name: 'Feb', revenue: 3000, target: 1398 },
  { name: 'Mar', revenue: 2000, target: 9800 },
  { name: 'Apr', revenue: 2780, target: 3908 },
  { name: 'May', revenue: 1890, target: 4800 },
  { name: 'Jun', revenue: 2390, target: 3800 },
  { name: 'Jul', revenue: 3490, target: 4300 },
];

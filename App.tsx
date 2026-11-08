
import React, { useState, useMemo, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { QuotationsPage } from './pages/QuotationsPage';
import { CustomersPage } from './pages/CustomersPage';
import { InventoryPage } from './pages/InventoryPage';
import { FinancialsPage } from './pages/FinancialsPage';
import { ReportsPage } from './pages/ReportsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { SettingsPage } from './pages/SettingsPage';
import { SupportPage } from './pages/SupportPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { Toaster, toast as befToast } from './components/ui/toast';
import { TooltipProvider } from './components/ui/tooltip';
import { AppNotification } from './types';

type ToastType = 'success' | 'error' | 'info';

interface AppContextType {
  showToast: (message: string, type?: ToastType) => void;
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  simulateDemo: () => void;
  clearDemo: () => void;
  isDemoActive: boolean;
  orders: any[];
  customers: any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: '1', title: 'New Order Received', message: 'Order #ORD-7237 processed for Sarah Jenkins.', time: '2m ago', type: 'order', read: false },
  { id: '2', title: 'System Security Alert', message: 'New login detected from Austin, TX.', time: '15m ago', type: 'system', read: false },
  { id: '3', title: 'Inventory Warning', message: 'Premium ERP License stock is below 15%.', time: '1h ago', type: 'inventory', read: false },
  { id: '4', title: 'Payment Confirmed', message: 'Invoice #INV-2023-088 paid by Studio Hub.', time: '3h ago', type: 'system', read: false },
  { id: '5', title: 'Customer Feedback', message: 'Alice Thompson rated the support experience 5/5.', time: '5h ago', type: 'customer', read: true },
];

const AppMain: React.FC = () => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    if (type === 'error') befToast.error(message);
    else if (type === 'info') befToast.info(message);
    else befToast.success(message);
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const [isDemoActive, setIsDemoActive] = useState(false);

  const simulateDemo = () => {
    import('./demoData').then(data => {
      setNotifications(prev => [...data.DEMO_NOTIFICATIONS, ...prev]);
      setOrders(data.DEMO_ORDERS);
      setCustomers(data.DEMO_CUSTOMERS);
      setIsDemoActive(true);
      showToast('System-wide demo data simulated', 'success');
    });
  };

  const clearDemo = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    setOrders([]);
    setCustomers([]);
    setIsDemoActive(false);
    showToast('Demo data flushed from system', 'info');
  };

  const contextValue = useMemo(() => ({
    showToast,
    globalSearch,
    setGlobalSearch,
    notifications,
    setNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    simulateDemo,
    clearDemo,
    isDemoActive,
    orders,
    customers
  }), [globalSearch, notifications, unreadCount, isDemoActive, orders, customers]);

  return (
    <AppContext.Provider value={contextValue}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="quotations" element={<QuotationsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="financials" element={<FinancialsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="changelog" element={<ChangelogPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </AppContext.Provider>
  );
};

const App: React.FC = () => <AppMain />;

export default App;

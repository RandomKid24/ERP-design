import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert } from '../components/ui/alert';
import { Spinner } from '../components/ui/spinner';
import { Separator } from '../components/ui/separator';
import {
  BarChartIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
  WarehouseIcon,
} from '../components/ui/icons';

const PILLARS = [
  { label: 'Sales', icon: ShoppingCartIcon },
  { label: 'Inventory', icon: WarehouseIcon },
  { label: 'Finance', icon: BarChartIcon },
];

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => setIsCheckingAuth(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (username === 'admin' && password === 'admin') {
        showToast('Welcome back, Admin!');
        navigate('/');
      } else {
        setError('Invalid username or password. Try admin/admin.');
      }
    }, 1200);
  };

  if (isCheckingAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner className="size-6 text-primary" />
          <p className="text-sm text-muted-foreground">Checking authentication…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.15fr_1fr]">
      <div className="relative hidden flex-col justify-between border-r bg-secondary/30 p-10 lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-base font-semibold text-primary-foreground">A</span>
          <div>
            <p className="text-sm font-semibold leading-tight">Aether ERP</p>
            <p className="text-xs text-muted-foreground">Enterprise resource planning</p>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            One workspace for the whole operation.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Orders, inventory, billing and financial reporting in a single system of record, built for teams that ship.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.label} className="grid gap-2 rounded-lg border bg-card p-3">
                <pillar.icon className="size-4 text-primary" />
                <span className="text-xs font-medium">{pillar.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">© 2026 Aether Systems. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="grid w-full max-w-sm gap-6">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-base font-semibold text-primary-foreground">A</span>
            <p className="text-sm font-semibold">Aether ERP</p>
          </div>

          <div className="grid gap-1.5">
            <h2 className="text-xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to access the ERP dashboard.</p>
          </div>

          {error && (
            <Alert variant="danger" title="Sign-in failed">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="username" required>Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                leftIcon={<UserIcon />}
                disabled={isLoading}
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="password" required>Password</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                leftIcon={<LockIcon />}
                disabled={isLoading}
                autoComplete="current-password"
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                }
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading} disabled={!username || !password}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="grid gap-3">
            <Separator />
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldIcon className="size-3.5" />
              <span>Demo access: admin / admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { CurrencySelector } from '@/components/currency-selector';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/contexts/theme-context';
import { heights, spacing, iconSizes, zIndex, typography, gaps } from '@/lib/design-tokens';
import {
  Search,
  User,
  LayoutDashboard,
  Receipt,
  Tags,
  Upload,
  BarChart3,
  FileText,
  Zap,
  Menu,
  X,
  LogOut,
  UserCircle,
  Sun,
  Moon,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import type { Database } from '@/lib/supabase/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transacciones', href: '/transactions', icon: Receipt },
  { name: 'Categorías', href: '/categories', icon: Tags },
  { name: 'Reglas Auto', href: '/rules', icon: Zap },
  // { name: 'Resumen', href: '/summary', icon: BarChart3 },
  { name: 'Subir', href: '/upload', icon: Upload },
  { name: 'Asistente AI', href: '/ai', icon: Sparkles, highlight: true },
];

export function Header() {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
        }
      }
    };

    getUserProfile();
  }, [supabase]);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const displayName = userProfile?.name || userProfile?.email?.split('@')[0] || 'Usuario';
  const displayEmail = userProfile?.email || '';

  return (
    <>
      <header className={cn('sticky top-0 border-b border-border bg-card', zIndex.sticky)}>
        <div className={cn('flex items-center justify-between px-4 lg:px-6', heights.header)}>
          {/* Logo y Navegación */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo />
              <h1 className="text-xl font-bold text-primary">Ahorrin</h1>
            </Link>

            {/* Navegación Desktop */}
            <nav className={cn('hidden lg:flex items-center', gaps.xs)}>
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const Icon = item.icon;
                const isAI = 'highlight' in item && item.highlight;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center rounded-lg px-2.5 py-1.5 font-medium transition-colors',
                      gaps.xs,
                      typography.bodySmall,
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isAI
                        ? 'text-primary hover:bg-primary/10'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className={iconSizes.sm} />
                    <span className="hidden xl:inline">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Acciones derecha */}
          <div className={cn('flex items-center', gaps.xs)}>

            {/* Búsqueda */}
            <div className="hidden md:block">
              {searchOpen ? (
                <div className="relative">
                  <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground', iconSizes.sm)} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                    className="h-9 w-64 rounded-lg border border-border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className={iconSizes.md} />
                </Button>
              )}
            </div>

            <CurrencySelector />

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            >
              {theme === 'light' ? <Moon className={iconSizes.md} /> : <Sun className={iconSizes.md} />}
            </Button>

            {/* Separador */}
            <div className="hidden md:flex items-center">
              <div className="h-6 w-px bg-border ml-1" />
            </div>

            {/* Perfil Desktop */}
            <div className="hidden md:flex items-center gap-3 ml-2">
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:bg-muted px-2 py-1.5 rounded-lg transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className={iconSizes.sm} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-card-foreground leading-tight">{displayName}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{displayEmail}</p>
                  </div>
                </button>

                {/* Dropdown de Usuario */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50 py-1">
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <UserCircle className={iconSizes.sm} />
                      Mi Perfil
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors w-full text-left"
                    >
                      <LogOut className={iconSizes.sm} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Menú Móvil */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className={iconSizes.md} /> : <Menu className={iconSizes.md} />}
            </Button>
          </div>
        </div>

        {/* Navegación Móvil */}
        {mobileMenuOpen && (
          <div className="border-t border-border lg:hidden">
            <nav className="space-y-1 px-4 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const Icon = item.icon;
                const isAI = 'highlight' in item && item.highlight;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isAI
                        ? 'text-primary hover:bg-primary/10 font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className={iconSizes.md} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Búsqueda móvil */}
            <div className="border-t border-border px-4 py-3 md:hidden">
              <div className="relative">
                <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground', iconSizes.sm)} />
                <input
                  type="text"
                  placeholder="Buscar transacciones..."
                  className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Perfil móvil */}
            <div className="border-t border-border px-4 py-3 md:hidden">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className={iconSizes.md} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{displayEmail}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
              >
                <LogOut className={iconSizes.sm} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

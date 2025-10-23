'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { heights, spacing, iconSizes, typography, gaps } from '@/lib/design-tokens';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Upload,
  Settings,
  BarChart3,
  FileText,
  Zap,
  Sparkles,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transacciones', href: '/transactions', icon: Receipt },
  { name: 'Categorías', href: '/categories', icon: Tags },
  { name: 'Reglas Auto', href: '/rules', icon: Zap },
  // { name: 'Resumen Mensual', href: '/summary', icon: BarChart3 },
  { name: 'Subir Extracto', href: '/upload', icon: Upload },
  { name: 'Asistente AI', href: '/ai', icon: Sparkles },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border/50 bg-card">
      <div className={cn('flex items-center border-b border-border/50 px-6', heights.header)}>
        <h1 className={cn('text-foreground font-semibold tracking-tight', typography.h3)}>Ahorrin</h1>
      </div>

      <nav className={cn('flex-1 px-3 py-6', 'flex flex-col space-y-1')}>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-all duration-150',
                typography.bodySmall,
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <Icon className={cn(iconSizes.md, isActive ? 'text-foreground' : 'text-muted-foreground')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className={cn('border-t border-border/50', `p-${spacing.lg}`)}>
        <p className={typography.caption + ' text-muted-foreground'}>Ahorrin v1.0.0</p>
      </div>
    </div>
  );
}

import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionVariants } from '@/lib/design-tokens';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, subtitle, icon: _icon }: StatCardProps) {
  return (
    <motion.div variants={motionVariants.staggerItem}>
      <Card className="p-4">
        <dl className="flex flex-col gap-1">
          <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {label}
          </dt>
          <dd className="font-mono text-2xl tabular-nums text-foreground">
            {value}
          </dd>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </dl>
      </Card>
    </motion.div>
  );
}

import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto bg-background px-4 md:px-6 lg:px-8 pt-8 pb-8">
        {children}
      </main>
    </div>
  );
}

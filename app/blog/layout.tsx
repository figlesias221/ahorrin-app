import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog de Finanzas Personales Uruguay | Ahorrin',
  description:
    'Guías, consejos y comparativas sobre finanzas personales en Uruguay. Aprende a controlar tus gastos, elegir tarjetas y mejorar tu presupuesto.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AdSense script is loaded once globally in app/layout.tsx with lazyOnload
  // strategy. Don't duplicate it here.
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {children}
      </main>
      <Footer />
    </>
  );
}

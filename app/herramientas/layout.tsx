import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Herramientas Gratuitas | Ahorrín',
  description: 'Calculadoras y herramientas gratuitas para controlar tus finanzas personales en Uruguay.',
};

export default function HerramientasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}

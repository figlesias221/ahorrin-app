import Script from 'next/script';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog de Finanzas Personales Uruguay | Ahorrin',
  description: 'Guías, consejos y comparativas sobre finanzas personales en Uruguay. Aprende a controlar tus gastos, elegir tarjetas y mejorar tu presupuesto.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {children}
      </main>
      <Footer />
    </>
  );
}

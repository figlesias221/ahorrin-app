import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

/**
 * Shared shell for all marketing / info pages: glossary, methodology, author,
 * about, contact, FAQ, banks, pricing, legal. Mounts Navbar + Footer once so
 * every page in the group has consistent chrome and so the user always has a
 * way back to the rest of the app.
 *
 * Pages inside `(marketing)/` should still apply `pt-28 sm:pt-36` (or similar)
 * to their first section, since the Navbar is `fixed top-0` and floats over
 * the content.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { CurrencyProvider } from "@/contexts/currency-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { ToastProvider } from "@/contexts/toast-context";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ScrollTracker } from "@/components/analytics/scroll-tracker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gasty.app'),
  title: {
    default: "Gasty - Gestión Financiera Personal Inteligente | Control de Gastos",
    template: "%s | Gasty"
  },
  description: "App para controlar gastos y finanzas personales en Uruguay. Importá extractos bancarios de BBVA, Scotia, Itaú automáticamente. Categorización inteligente, gráficas en tiempo real y reportes personalizados. Gratis y sin conectar tu banco.",
  keywords: [
    // Primary keywords (alto volumen)
    "finanzas personales",
    "control de gastos",
    "app finanzas",
    "gestión financiera personal",
    "presupuesto personal",

    // Long-tail commercial (alta conversión)
    "app para controlar gastos uruguay",
    "como organizar finanzas personales uruguay",
    "mejor app finanzas personales uruguay",
    "app control gastos gratis",
    "categorizar gastos automaticamente",
    "app presupuesto familiar uruguay",

    // Bank-specific (geo-targeted)
    "extracto bancario bbva uruguay",
    "scotiabank uruguay",
    "itau uruguay extracto",
    "brou extracto bancario",
    "importar extracto bancario",

    // Feature-based
    "categorizar transacciones bancarias",
    "dashboard financiero personal",
    "graficas gastos mensuales",
    "inteligencia artificial finanzas",

    // General Uruguay finance
    "finanzas personales Uruguay",
    "ahorro personal uruguay",
    "app finanzas Uruguay",
    "gestionar gastos mensuales"
  ],
  authors: [{ name: "Gasty" }],
  creator: "Gasty",
  publisher: "Gasty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: "https://www.gasty.app",
    title: "Gasty - App Control de Gastos y Finanzas Personales Uruguay",
    description: "La mejor app para controlar gastos en Uruguay. Importá extractos de BBVA, Scotia, Itaú. Categorización automática, gráficas y reportes. Gratis.",
    siteName: "Gasty",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gasty - Dashboard de Gestión Financiera Personal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gasty - App Control de Gastos y Finanzas Personales Uruguay",
    description: "La mejor app para controlar gastos en Uruguay. Importá extractos de BBVA, Scotia, Itaú. Categorización automática. Gratis.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-UY" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://www.gasty.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Force light mode on landing page
                  const isLandingPage = window.location.pathname === '/' && !window.location.search;

                  if (isLandingPage) {
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    const stored = localStorage.getItem('theme');
                    const theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <Analytics />
        <ScrollTracker />
        <ThemeProvider>
          <ToastProvider>
            <CurrencyProvider>
              {children}
            </CurrencyProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

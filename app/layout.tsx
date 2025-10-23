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
  metadataBase: new URL('https://www.ahorrin.app'),
  title: {
    default: "Ahorrin - Tu Coach de Finanzas Personales en Uruguay",
    template: "%s | Ahorrin"
  },
  description: "Tomá control total de tus finanzas en Uruguay. Importá extractos de cualquier banco (BBVA, Itaú, Scotia, BROU, Santander). Categorización automática con IA. Gráficas en tiempo real. Sin conectar tu banco.",
  keywords: [
    // Primary keywords (alto volumen) - Uruguay focused
    "control finanzas personales uruguay",
    "app finanzas personales uruguay",
    "gestión gastos uruguay",
    "presupuesto personal uruguay",
    "control de gastos",

    // Long-tail commercial (alta conversión)
    "mejor app controlar gastos uruguay",
    "app gratuita finanzas personales uruguay",
    "como controlar mis gastos uruguay",
    "organizar finanzas personales uruguay",
    "app presupuesto familiar uruguay gratis",
    "control gastos sin conectar banco",

    // Bank-specific (geo-targeted)
    "extracto bancario bbva uruguay",
    "extracto scotiabank uruguay",
    "extracto itau uruguay",
    "extracto brou uruguay",
    "importar extracto bancario uruguay",
    "extracto santander uruguay",
    "extracto heritage uruguay",

    // Feature-based (benefit-oriented)
    "categorizar gastos automaticamente",
    "ia finanzas personales",
    "dashboard financiero personal",
    "graficas gastos mensuales",
    "reportes financieros personales",
    "analisis gastos mensuales",

    // Pain points & solutions
    "donde se va mi plata",
    "ahorrar dinero uruguay",
    "reducir gastos personales",
    "finanzas personales facil",

    // Privacy & security
    "app finanzas sin conectar banco",
    "finanzas personales seguro",
    "privacidad finanzas uruguay"
  ],
  authors: [{ name: "Ahorrin" }],
  creator: "Ahorrin",
  publisher: "Ahorrin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: "https://www.ahorrin.app",
    title: "Ahorrin - Tu Coach de Finanzas Personales en Uruguay",
    description: "Tomá control de tus finanzas. Importá extractos de cualquier banco uruguayo. Categorización automática con IA. Gráficas en tiempo real. Sin conectar tu banco.",
    siteName: "Ahorrin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahorrin - Tu Coach de Finanzas Personales en Uruguay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahorrin - Tu Coach de Finanzas en Uruguay 🇺🇾",
    description: "Tomá control de tus finanzas. Importá extractos de BBVA, Itaú, Scotia, BROU. Categorización automática con IA. Sin conectar tu banco.",
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
        <link rel="canonical" href="https://www.ahorrin.app" />
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

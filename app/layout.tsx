import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CurrencyProvider } from "@/contexts/currency-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { ToastProvider } from "@/contexts/toast-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gasty-app.xyz221.workers.dev'),
  title: {
    default: "Gasty - Gestión Financiera Personal Inteligente | Control de Gastos",
    template: "%s | Gasty"
  },
  description: "Controla tus finanzas personales con inteligencia artificial. Importa extractos bancarios (BBVA, Scotia, Itaú), categorización automática, gráficas en tiempo real y reportes personalizados. Ahorra tiempo y toma mejores decisiones financieras.",
  keywords: [
    "gestión financiera personal",
    "control de gastos",
    "finanzas personales Uruguay",
    "categorización automática",
    "extractos bancarios",
    "BBVA Uruguay",
    "Scotiabank Uruguay",
    "Itaú Uruguay",
    "dashboard financiero",
    "presupuesto personal",
    "análisis de gastos",
    "reportes financieros",
    "ahorro personal",
    "finanzas inteligentes",
    "app finanzas Uruguay"
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
    url: "https://gasty-app.xyz221.workers.dev",
    title: "Gasty - Gestión Financiera Personal Inteligente",
    description: "Control total de tus finanzas. Importa extractos, categorización automática con IA, gráficas en tiempo real. Compatible con BBVA, Scotia e Itaú.",
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
    title: "Gasty - Gestión Financiera Personal Inteligente",
    description: "Control total de tus finanzas. Importa extractos, categorización automática con IA, gráficas en tiempo real.",
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
        <link rel="canonical" href="https://gasty-app.xyz221.workers.dev" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="alternate icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
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

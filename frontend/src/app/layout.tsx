import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/contexts/auth-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DHARTI AI — Climate Decision Intelligence',
    template: '%s | DHARTI AI',
  },
  description:
    'AI-Powered platform helping farmers and governments make smarter climate decisions. Transform satellite data, weather patterns, and soil intelligence into actionable decisions.',
  keywords: [
    'climate intelligence',
    'agriculture AI',
    'crop prediction',
    'flood forecast',
    'farm analytics',
    'sustainability',
  ],
  authors: [{ name: 'DHARTI AI' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'DHARTI AI',
    title: 'DHARTI AI — Climate Decision Intelligence',
    description: 'Make smarter decisions for every acre of Earth',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <TooltipProvider>
                {children}
                <Toaster position="bottom-right" />
              </TooltipProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

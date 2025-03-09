import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/nav/footer';
import { Providers } from './providers';
import { Navbar } from '@/components/nav/navbar';
import { AuthInitializer } from '@/components/auth/auth-initializer';
import ErrorBoundary from '@/components/error-boundary';
import { PageTransitionProvider } from "@/components/ui/page-transition";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Adopt - Find your perfect pet companion',
  description: 'Connect with pets in need of loving homes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthInitializer />
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <PageTransitionProvider>
                <main className="flex-1">{children}</main>
              </PageTransitionProvider>
              <Footer />
            </div>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}

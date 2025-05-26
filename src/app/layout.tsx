import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import MainLayout from '@/components/layout/MainLayout';
import Navbar from '@/components/ui-custom/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shuabaarambh',
  description: 'Your one-stop shop for all your needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <Navbar/>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
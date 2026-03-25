import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import BootstrapClient from '@/components/BootstrapClient';

export const metadata: Metadata = {
  title: 'TorqueLab',
  description: 'Car repair, performance parts installations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body>
        <BootstrapClient />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
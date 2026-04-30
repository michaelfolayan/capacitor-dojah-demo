import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dojah KYC Demo',
  description: 'Capacitor + Next.js Dojah KYC Demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
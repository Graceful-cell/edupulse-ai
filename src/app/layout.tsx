import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EduPulse AI',
  description: 'AI-powered workspace for educators',
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

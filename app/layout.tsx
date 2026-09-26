import type { Metadata } from 'next';
import { Mulish } from 'next/font/google';
import './globals.css';

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-mulish',
});

export const metadata: Metadata = {
  title: 'ICICI Bank Relationship Manager Survey',
  description: 'ICICI Bank Relationship Manager customer feedback survey.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={mulish.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-100 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

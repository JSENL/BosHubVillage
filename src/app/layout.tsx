import type { Metadata } from 'next';
import { Providers } from './providers';
import '../index.css';

export const metadata: Metadata = {
  title: 'Local Community Hub - Discover Events, Businesses & Services',
  description:
    'Discover local events, businesses, and community services in your area. Connect with your neighborhood and explore what\'s happening around you.',
  keywords: 'local events, community, businesses, services, neighborhood, discover, map, social',
  openGraph: {
    title: 'Local Community Hub - Discover Events, Businesses & Services',
    description: 'Discover local events, businesses, and community services in your area.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

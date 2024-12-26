import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/navBar';
import Footer from '@/components/footer';
import '@/app/globals.css';
import '@/public/styles/katex.min.css';
import { siteConfig } from '@/config/site';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.url}`),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  generator: 'Next.js',
  applicationName: siteConfig.name,
  referrer: 'origin-when-cross-origin',
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  keywords: ['computer science', 'mathematics', 'blog', 'school'],
  openGraph: {
    title: {
      template: `%s | ${siteConfig.name}`,
      default: siteConfig.name,
    },
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'en_UK',
    type: 'website',
    images: ['images/favicon.png'],
  },
  alternates: {
    types: {
      'application/rss+xml': `${siteConfig.url}/feed.xml`,
    },
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <script defer data-domain="mkutay.dev" src="https://pl.mkutay.dev/js/script.file-downloads.hash.outbound-links.js"></script>
      </Head>
      <body className={`${inter.className} text-foreground bg-background`}>
        <ThemeProvider attribute="class">
          <main className="flex flex-col min-h-screen">
            <NavBar/>
            <div className="flex-1">{children}</div>
            <Footer/>
          </main>
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}

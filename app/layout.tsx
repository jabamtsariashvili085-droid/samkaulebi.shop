import React from "react"
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/components/boty/cart-context'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600']
});

const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'samkaulebi.shop — სამკაულები, სუნამოები, თავის მოვლა',
    template: '%s — samkaulebi.shop',
  },
  description: SITE_DESCRIPTION,
  generator: 'v0.app',
  keywords: ['სამკაულები', 'სუნამოები', 'თავის მოვლა', 'ბეჭდები', 'ყელსაბამები', 'პარფიუმერია', 'jewelry', 'perfume', 'haircare'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ka_GE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'samkaulebi.shop — სამკაულები, სუნამოები, თავის მოვლა',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'samkaulebi.shop — სამკაულები, სუნამოები, თავის მოვლა',
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#F7F4EF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ka" className="bg-background">
      <body className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}

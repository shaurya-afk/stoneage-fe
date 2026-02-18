import React from "react"
import type { Metadata } from 'next'
import { Host_Grotesk, Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const hostGrotesk = Host_Grotesk({ subsets: ["latin"], variable: "--font-host-grotesk" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://stoneage.app");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Stone Age | PDF to Excel – Extract Data from PDFs with AI",
    template: "%s | Stone Age",
  },
  description:
    "Extract data from PDFs automatically. PDF to Excel conversion, invoice extraction, and structured data extraction with AI. Reliable schema-driven PDF extraction for production.",
  keywords: [
    "pdf extraction",
    "extract data from pdf",
    "pdf to excel",
    "pdf data extraction",
    "extract text from pdf",
    "pdf parser",
    "invoice extraction",
    "document extraction",
    "structured data extraction",
    "AI pdf extraction",
    "pdf to spreadsheet",
  ],
  authors: [{ name: "Stone Age" }],
  creator: "Stone Age",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Stone Age",
    title: "Stone Age | PDF to Excel – Extract Data from PDFs with AI",
    description:
      "Extract data from PDFs automatically. PDF to Excel conversion, invoice extraction, and structured data extraction with AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stone Age – From PDFs to Production Data",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stone Age | PDF to Excel – Extract Data from PDFs with AI",
    description: "Extract data from PDFs automatically. PDF to Excel, invoice extraction, structured data with AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Stone Age",
    description:
      "Extract data from PDFs automatically. PDF to Excel conversion, invoice extraction, and structured data extraction with AI. Schema-driven PDF extraction for production.",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "PDF to Excel conversion",
      "Extract data from PDF",
      "Invoice extraction",
      "Structured data extraction",
      "AI-powered PDF parsing",
    ],
  };

  return (
    <html lang="en">
      <body className={`${hostGrotesk.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}

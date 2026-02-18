import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://stone-age-mu.vercel.app"),
  title: "Extract Data from PDF – PDF to Excel",
  description:
    "Extract data from PDF files with AI. Upload a PDF to get structured data, export to Excel.",
  openGraph: {
    title: "Extract Data from PDF | Stone Age – PDF to Excel",
    description:
      "Extract data from PDF files with AI. Upload a PDF, get structured data and Excel export.",
    url: "/",
    siteName: "Stone Age",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Extract Data from PDF | Stone Age – PDF to Excel",
    description:
      "Extract data from PDF files with AI. Upload a PDF, get structured data and Excel export.",
    images: ["/og-image.png"],
  },
};

export default function ExtractLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

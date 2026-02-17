import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started – Upload PDFs for Extraction",
  description:
    "Upload PDFs, images, or raw text to Stone Age. Start extracting structured data, convert PDF to Excel, and run AI-powered document extraction.",
  openGraph: {
    title: "Get Started | Stone Age – Upload PDFs for Extraction",
    description:
      "Upload PDFs, images, or raw text to Stone Age. Start extracting structured data and convert PDF to Excel.",
  },
};

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

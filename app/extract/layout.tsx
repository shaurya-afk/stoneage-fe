import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extract Data from PDF – PDF to Excel",
  description:
    "Extract data from PDF files with AI. Upload a PDF to get structured data, export to Excel. Invoice extraction, document parsing, and schema-validated output.",
  openGraph: {
    title: "Extract Data from PDF | Stone Age – PDF to Excel",
    description:
      "Extract data from PDF files with AI. Upload a PDF, get structured data and Excel export. Invoice and document extraction.",
  },
};

export default function ExtractLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

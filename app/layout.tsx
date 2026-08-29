import type { Metadata, Viewport } from "next";
import { SITE_DESCRIPTION, SITE_METADATA_TITLE, SITE_NAME } from "@/lib/site/site-content";
import { getConfiguredSiteUrl } from "@/lib/site/seo";
import "./globals.css";

const configuredSiteUrl = getConfiguredSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: configuredSiteUrl ?? undefined,
  title: {
    default: SITE_METADATA_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: configuredSiteUrl ? { canonical: "/" } : undefined,
  applicationName: SITE_NAME,
  category: "corporate",
  openGraph: {
    title: SITE_METADATA_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_METADATA_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}

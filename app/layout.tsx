import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { SITE_DESCRIPTION, SITE_METADATA_TITLE, SITE_NAME } from "@/lib/site/site-content";
import { getPublicSiteUrl, isIndexingEnabled } from "@/lib/site/seo";
import "./globals.css";

const configuredSiteUrl = getPublicSiteUrl();
const indexingEnabled = isIndexingEnabled();
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
});
const organizationJsonLd =
  indexingEnabled && configuredSiteUrl
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        alternateName: "LOOP Innovate",
        url: configuredSiteUrl.toString(),
        logo: new URL(
          "/brand/loop-combination-full-color.png",
          configuredSiteUrl,
        ).toString(),
      }
    : null;

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
  robots: indexingEnabled
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  applicationName: SITE_NAME,
  category: "corporate",
  openGraph: {
    title: SITE_METADATA_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
    url: configuredSiteUrl?.toString(),
  },
  twitter: {
    card: "summary_large_image",
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
    <html
      lang="ja"
      className={`${inter.variable} ${notoSansJp.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        {organizationJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
            }}
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}

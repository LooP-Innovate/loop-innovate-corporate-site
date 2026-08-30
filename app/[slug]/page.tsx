import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoutePage } from "@/components/site/RoutePage";
import { isTokushohoPublicationReady } from "@/lib/site/legal-content";
import { isSiteRouteSlug, SITE_NAME, SITE_ROUTE_CONTENT, SITE_ROUTE_SLUGS } from "@/lib/site/site-content";
import { getPublicSiteUrl, isIndexingEnabled } from "@/lib/site/seo";

type SiteRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SITE_ROUTE_SLUGS.filter(
    (slug) => slug !== "tokushoho" || isTokushohoPublicationReady(),
  ).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SiteRoutePageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isSiteRouteSlug(slug)) {
    return {};
  }

  const content = SITE_ROUTE_CONTENT[slug];
  const configuredSiteUrl = getPublicSiteUrl();
  const socialImageUrl = configuredSiteUrl
    ? new URL("/opengraph-image", configuredSiteUrl).toString()
    : null;
  const routeIndexingEnabled =
    isIndexingEnabled() &&
    (slug !== "tokushoho" || isTokushohoPublicationReady());

  return {
    title: { absolute: content.metadataTitle },
    description: content.metaDescription,
    alternates: routeIndexingEnabled && configuredSiteUrl
      ? { canonical: `/${content.slug}` }
      : undefined,
    robots: routeIndexingEnabled
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      title: content.metadataTitle,
      description: content.metaDescription,
      siteName: SITE_NAME,
      locale: "ja_JP",
      type: "website",
      url: configuredSiteUrl
        ? new URL(`/${content.slug}`, configuredSiteUrl).toString()
        : undefined,
      images: socialImageUrl
        ? [
            {
              url: socialImageUrl,
              width: 1200,
              height: 630,
              alt: "L∞P Innovate — 現場を、仕組みから変える。",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: content.metadataTitle,
      description: content.metaDescription,
      images: socialImageUrl ? [socialImageUrl] : undefined,
    },
  };
}

export default async function SiteRoutePage({ params }: SiteRoutePageProps) {
  const { slug } = await params;

  if (!isSiteRouteSlug(slug)) {
    notFound();
  }

  if (slug === "tokushoho" && !isTokushohoPublicationReady()) {
    notFound();
  }

  return <RoutePage content={SITE_ROUTE_CONTENT[slug]} />;
}

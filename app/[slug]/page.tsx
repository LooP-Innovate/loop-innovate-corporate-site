import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoutePage } from "@/components/site/RoutePage";
import { isSiteRouteSlug, SITE_ROUTE_CONTENT, SITE_ROUTE_SLUGS } from "@/lib/site/site-content";
import { getConfiguredSiteUrl } from "@/lib/site/seo";

type SiteRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SITE_ROUTE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SiteRoutePageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isSiteRouteSlug(slug)) {
    return {};
  }

  const content = SITE_ROUTE_CONTENT[slug];
  const configuredSiteUrl = getConfiguredSiteUrl();

  return {
    title: { absolute: content.metadataTitle },
    description: content.metaDescription,
    alternates: configuredSiteUrl
      ? { canonical: `/${content.slug}` }
      : undefined,
    openGraph: {
      title: content.metadataTitle,
      description: content.metaDescription,
      siteName: "L∞P Innovate",
      locale: "ja_JP",
      type: "website",
      images: [],
    },
    twitter: {
      card: "summary",
      title: content.metadataTitle,
      description: content.metaDescription,
      images: [],
    },
  };
}

export default async function SiteRoutePage({ params }: SiteRoutePageProps) {
  const { slug } = await params;

  if (!isSiteRouteSlug(slug)) {
    notFound();
  }

  return <RoutePage content={SITE_ROUTE_CONTENT[slug]} />;
}

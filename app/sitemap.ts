import type { MetadataRoute } from "next";
import { SITE_ROUTE_SLUGS } from "@/lib/site/site-content";
import { isTokushohoPublicationReady } from "@/lib/site/legal-content";
import { getPublicSiteUrl, isIndexingEnabled } from "@/lib/site/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getPublicSiteUrl();

  if (!siteUrl || !isIndexingEnabled()) {
    return [];
  }

  const publicSlugs = SITE_ROUTE_SLUGS.filter(
    (slug) => slug !== "tokushoho" || isTokushohoPublicationReady(),
  );
  const paths = ["", ...publicSlugs.map((slug) => `/${slug}`)];

  return paths.map((path) => ({
    url: new URL(path || "/", siteUrl).toString(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}

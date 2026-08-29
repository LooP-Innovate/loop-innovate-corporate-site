import type { MetadataRoute } from "next";
import { SITE_ROUTE_SLUGS } from "@/lib/site/site-content";
import { getConfiguredSiteUrl, isIndexingEnabled } from "@/lib/site/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getConfiguredSiteUrl();

  if (!siteUrl || !isIndexingEnabled()) {
    return [];
  }

  const paths = ["", ...SITE_ROUTE_SLUGS.map((slug) => `/${slug}`)];

  return paths.map((path) => ({
    url: new URL(path || "/", siteUrl).toString(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}

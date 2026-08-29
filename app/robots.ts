import type { MetadataRoute } from "next";
import { getConfiguredSiteUrl, isIndexingEnabled } from "@/lib/site/seo";

export default function robots(): MetadataRoute.Robots {
  const indexingEnabled = isIndexingEnabled();
  const siteUrl = getConfiguredSiteUrl();

  return {
    rules: {
      userAgent: "*",
      ...(indexingEnabled ? { allow: "/" } : { disallow: "/" }),
    },
    sitemap:
      indexingEnabled && siteUrl
        ? new URL("/sitemap.xml", siteUrl).toString()
        : undefined,
  };
}

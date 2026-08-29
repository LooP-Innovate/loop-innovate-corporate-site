const SITE_URL_ENVIRONMENT_KEY = "NEXT_PUBLIC_SITE_URL";

export function getConfiguredSiteUrl(): URL | null {
  const value = process.env[SITE_URL_ENVIRONMENT_KEY]?.trim();

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    url.pathname = url.pathname.replace(/\/$/, "");
    return url;
  } catch {
    return null;
  }
}

export function isIndexingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SITE_INDEXING === "true";
}

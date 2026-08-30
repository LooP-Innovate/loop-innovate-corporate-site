const SITE_URL_ENVIRONMENT_KEY = "NEXT_PUBLIC_SITE_URL";

export function isPublicHttpsSiteUrl(url: URL | null): url is URL {
  if (!url || url.protocol !== "https:" || url.username || url.password) {
    return false;
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname === "::1" ||
    (hostname.includes(":") &&
      (hostname.startsWith("fc") ||
        hostname.startsWith("fd") ||
        hostname.startsWith("fe8") ||
        hostname.startsWith("fe9") ||
        hostname.startsWith("fea") ||
        hostname.startsWith("feb")))
  ) {
    return false;
  }

  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const octets = ipv4.slice(1).map(Number);
    if (octets.some((octet) => octet > 255)) return false;
    const [first, second] = octets;
    if (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168)
    ) {
      return false;
    }
  }

  return true;
}

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

export function getPublicSiteUrl(): URL | null {
  const url = getConfiguredSiteUrl();
  return isPublicHttpsSiteUrl(url) ? url : null;
}

export function isIndexingEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_SITE_INDEXING === "true" &&
    process.env.NEXT_PUBLIC_CONTACT_READY === "true" &&
    getPublicSiteUrl() !== null
  );
}

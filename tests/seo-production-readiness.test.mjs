import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  isTokushohoPublicationReady,
  TOKUSHOHO_OPERATOR_CONFIG,
} from "../lib/site/legal-content.ts";
import {
  getConfiguredSiteUrl,
  getPublicSiteUrl,
  isIndexingEnabled,
  isPublicHttpsSiteUrl,
} from "../lib/site/seo.ts";

test("keeps indexing behind HTTPS, contact, and explicit indexing gates", () => {
  const original = {
    url: process.env.NEXT_PUBLIC_SITE_URL,
    indexing: process.env.NEXT_PUBLIC_SITE_INDEXING,
    contact: process.env.NEXT_PUBLIC_CONTACT_READY,
  };

  try {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    process.env.NEXT_PUBLIC_SITE_INDEXING = "true";
    process.env.NEXT_PUBLIC_CONTACT_READY = "true";
    assert.equal(isIndexingEnabled(), false);

    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.NEXT_PUBLIC_CONTACT_READY = "false";
    assert.equal(isIndexingEnabled(), false);

    process.env.NEXT_PUBLIC_CONTACT_READY = "true";
    assert.equal(isIndexingEnabled(), true);
    assert.equal(isPublicHttpsSiteUrl(getConfiguredSiteUrl()), true);

    process.env.NEXT_PUBLIC_SITE_URL = "https://192.168.1.20";
    assert.equal(getPublicSiteUrl(), null);
    assert.equal(isIndexingEnabled(), false);
  } finally {
    for (const [key, value] of Object.entries(original)) {
      const environmentKey =
        key === "url"
          ? "NEXT_PUBLIC_SITE_URL"
          : key === "indexing"
            ? "NEXT_PUBLIC_SITE_INDEXING"
            : "NEXT_PUBLIC_CONTACT_READY";
      if (value === undefined) delete process.env[environmentKey];
      else process.env[environmentKey] = value;
    }
  }
});

test("withholds Tokushoho publication until every operator fact is confirmed", () => {
  assert.equal(isTokushohoPublicationReady(), false);
  assert.equal(
    isTokushohoPublicationReady({
      ...TOKUSHOHO_OPERATOR_CONFIG,
      publicationApproval: "approved",
      address: "Example Prefecture, Example City 1-2-3",
      phone: "+81-00-0000-0000",
      publicEmail: "contact@example.com",
      paymentMethods: "Bank transfer after invoice issuance",
      cancellationTerms: "Cancellation terms shown before application",
      recurringCancellationDeadline: "No recurring contract is offered",
      stripeTerms: "Online card payment is not offered",
    }),
    true,
  );
  assert.equal(
    isTokushohoPublicationReady({
      ...TOKUSHOHO_OPERATOR_CONFIG,
      publicationApproval: "approved",
      address: "確認中",
      phone: "+81-00-0000-0000",
      publicEmail: "contact@example.com",
      paymentMethods: "Bank transfer after invoice issuance",
      cancellationTerms: "Cancellation terms shown before application",
      recurringCancellationDeadline: "No recurring contract is offered",
      stripeTerms: "Online card payment is not offered",
    }),
    false,
  );
});

test("ships code-native social identity and explicit production gates", async () => {
  const [layout, route, sitemap, icon, og, env, nextConfig] = await Promise.all([
    readFile("app/layout.tsx", "utf8"),
    readFile("app/[slug]/page.tsx", "utf8"),
    readFile("app/sitemap.ts", "utf8"),
    readFile("app/icon.tsx", "utf8"),
    readFile("app/opengraph-image.tsx", "utf8"),
    readFile(".env.example", "utf8"),
    readFile("next.config.ts", "utf8"),
  ]);

  assert.match(layout, /Organization/);
  assert.match(layout, /alternateName: "LOOP Innovate"/);
  assert.doesNotMatch(layout, /LocalBusiness|streetAddress|telephone/);
  assert.match(route, /isTokushohoPublicationReady/);
  assert.match(route, /const socialImageUrl = configuredSiteUrl/);
  assert.match(route, /images: socialImageUrl/);
  assert.match(route, /url: configuredSiteUrl/);
  assert.match(
    layout,
    /alternates:\s*indexingEnabled && configuredSiteUrl/,
  );
  assert.match(
    route,
    /alternates: routeIndexingEnabled && configuredSiteUrl/,
  );
  assert.match(sitemap, /isTokushohoPublicationReady/);
  assert.match(icon, /∞/);
  assert.match(og, /FIELD TO SYSTEM/);
  assert.match(env, /NEXT_PUBLIC_CONTACT_READY=false/);
  assert.match(nextConfig, /source: "\/terms-of-service"/);
  assert.match(nextConfig, /destination: "\/terms"/);
  assert.match(nextConfig, /statusCode: 301/);
});

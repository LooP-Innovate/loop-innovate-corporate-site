import { readFileSync, writeFileSync } from "node:fs";
import { brotliDecompressSync, gunzipSync, inflateSync } from "node:zlib";
import http from "node:http";
import https from "node:https";

const [, , inventoryPath, outputPath] = process.argv;

if (!inventoryPath) {
  console.error(
    "Usage: node scripts/measure-transfer-baseline.mjs <browser-inventory.json> [output.json]",
  );
  process.exit(1);
}

const inventory = JSON.parse(readFileSync(inventoryPath, "utf8"));

function decodeBody(body, encoding) {
  switch (encoding) {
    case "br":
      return brotliDecompressSync(body);
    case "gzip":
      return gunzipSync(body);
    case "deflate":
      return inflateSync(body);
    default:
      return body;
  }
}

function responseHeaderBytes(response) {
  const statusLine = `HTTP/${response.httpVersion} ${response.statusCode} ${response.statusMessage}\r\n`;
  const headers = [];

  for (let index = 0; index < response.rawHeaders.length; index += 2) {
    headers.push(`${response.rawHeaders[index]}: ${response.rawHeaders[index + 1]}\r\n`);
  }

  return Buffer.byteLength(`${statusLine}${headers.join("")}\r\n`);
}

function fetchFresh(url, redirects = 0) {
  if (redirects > 5) {
    return Promise.reject(new Error(`Too many redirects: ${url}`));
  }

  const client = url.startsWith("https:") ? https : http;

  return new Promise((resolve, reject) => {
    const request = client.get(
      url,
      {
        headers: {
          accept:
            "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "accept-encoding": "br, gzip, deflate",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "user-agent": "LooP-Phase-0-Transfer-Baseline/1.0",
        },
      },
      (response) => {
        const location = response.headers.location;

        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          location
        ) {
          response.resume();
          resolve(fetchFresh(new URL(location, url).href, redirects + 1));
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          try {
            const body = Buffer.concat(chunks);
            const decoded = decodeBody(body, response.headers["content-encoding"]);
            const headerBytes = responseHeaderBytes(response);
            resolve({
              url,
              status: response.statusCode,
              contentType: response.headers["content-type"] ?? null,
              contentEncoding: response.headers["content-encoding"] ?? "identity",
              headerBytes,
              bodyTransferredBytes: body.length,
              transferredBytes: body.length + headerBytes,
              resourceBytes: decoded.length,
            });
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    request.on("error", (error) => {
      reject(new Error(`${url}: ${error.message}`));
    });
  });
}

async function fetchFreshWithRetry(url, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchFresh(url);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function isJourneyUrl(url) {
  const parsed = new URL(url);
  const optimizedSource = parsed.searchParams.get("url") ?? "";
  return parsed.pathname.includes("/media/journey/") || optimizedSource.includes("/media/journey/");
}

function summarize(entries) {
  return entries.reduce(
    (summary, entry) => ({
      count: summary.count + 1,
      transferredBytes: summary.transferredBytes + entry.transferredBytes,
      resourceBytes: summary.resourceBytes + entry.resourceBytes,
    }),
    { count: 0, transferredBytes: 0, resourceBytes: 0 },
  );
}

async function measureStage(stage, previousUrls) {
  const byUrl = new Map();

  if (stage.pageUrl?.startsWith("http")) {
    byUrl.set(stage.pageUrl, { kind: "document", url: stage.pageUrl });
  }

  for (const asset of stage.assets ?? []) {
    if (asset.url?.startsWith("http")) {
      byUrl.set(asset.url, { kind: asset.kind, url: asset.url });
    }
  }

  const measured = [];

  for (const asset of byUrl.values()) {
    const transfer = await fetchFreshWithRetry(asset.url);
    measured.push({
      ...transfer,
      kind: asset.kind,
      journey: isJourneyUrl(asset.url),
      incremental: !previousUrls.has(asset.url),
    });
  }

  const groups = {
    document: summarize(measured.filter((entry) => entry.kind === "document")),
    css: summarize(measured.filter((entry) => entry.kind === "stylesheet")),
    js: summarize(measured.filter((entry) => entry.kind === "script")),
    fonts: summarize(measured.filter((entry) => entry.kind === "font")),
    images: summarize(measured.filter((entry) => entry.kind === "image")),
    journey: summarize(measured.filter((entry) => entry.journey)),
    incremental: summarize(measured.filter((entry) => entry.incremental)),
    cumulative: summarize(measured),
  };

  return { entries: measured, groups, urls: new Set(byUrl.keys()) };
}

const report = {
  methodology: {
    cache: "Cache-Control: no-cache; Pragma: no-cache",
    transferredSize: "HTTP response body plus HTTP/1 response headers",
    resourceSize: "decoded response body",
    source: "URLs observed by the in-app browser page asset inventory",
  },
  measuredAt: new Date().toISOString(),
  viewports: {},
};

for (const [viewport, stages] of Object.entries(inventory)) {
  const viewportReport = {};
  let previousUrls = new Set();

  for (const stageName of ["initial", "build", "return"]) {
    const result = await measureStage(stages[stageName], previousUrls);
    viewportReport[stageName] = {
      groups: result.groups,
      entries: result.entries,
    };
    previousUrls = result.urls;
  }

  report.viewports[viewport] = viewportReport;
}

const serialized = `${JSON.stringify(report, null, 2)}\n`;

if (outputPath) {
  writeFileSync(outputPath, serialized);
  console.log(`Wrote transfer baseline: ${outputPath}`);
} else {
  process.stdout.write(serialized);
}

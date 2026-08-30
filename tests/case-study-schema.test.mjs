import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  FEATURED_CASE_STUDY,
  isCaseStudyPublishable,
} from "../lib/site/case-study-schema.ts";

test("publishes only the verified anonymous case without invented metrics", () => {
  assert.equal(isCaseStudyPublishable(FEATURED_CASE_STUDY), true);
  assert.equal(FEATURED_CASE_STUDY.clientDisclosurePermission, "anonymous-approved");
  assert.deepEqual(FEATURED_CASE_STUDY.verifiedMetrics, []);
});

test("blocks cases while client disclosure permission is pending", () => {
  assert.equal(
    isCaseStudyPublishable({
      ...FEATURED_CASE_STUDY,
      clientDisclosurePermission: "pending",
    }),
    false,
  );
});

test("connects the publication gate to the rendered case-study source", async () => {
  const content = await readFile("lib/site/site-content.ts", "utf8");

  assert.match(content, /PUBLISHED_FEATURED_CASE_STUDY/);
  assert.match(content, /isCaseStudyPublishable/);
  assert.match(content, /PUBLISHED_FEATURED_CASE_STUDY\?\.title/);
});

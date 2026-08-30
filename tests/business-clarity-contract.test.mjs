import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("makes the Hero business clear without narrowing it to care services", async () => {
  const hero = await readFile("app/page.tsx", "utf8");

  assert.match(
    hero,
    /AI・業務自動化・業務アプリを、現場で使える仕組みへ。/,
  );
  assert.match(hero, /heroDescriptorDesktop/);
  assert.match(hero, /heroDescriptorMobile/);
  assert.match(hero, /heroDescriptorA11y/);
  assert.doesNotMatch(hero, /aria-label="AI・業務自動化/);
  assert.doesNotMatch(hero, /福祉|介護|医療/);
});

test("separates FIELD LOOP philosophy from the L∞P-specific AI-FDE model", async () => {
  const [content, route] = await Promise.all([
    readFile("lib/site/site-content.ts", "utf8"),
    readFile("components/site/RoutePage.tsx", "utf8"),
  ]);

  assert.match(content, /FIELD LOOPは、現場を起点に改善を循環させる思想です/);
  assert.match(content, /AI-FDEは、その思想を実際のプロジェクトでどう支援するかを表すDelivery Modelです/);
  assert.match(content, /業界標準、資格、公的名称を示すものではありません/);
  assert.doesNotMatch(content, /AI-FDE\s*=\s*Forward Deployed Engineer/);
  assert.match(route, /L∞P-SPECIFIC \/ 現場密着型のAI実装支援モデル/);
});

test("publishes all four tax-exclusive starting prices and the approved note", async () => {
  const content = await readFile("lib/site/site-content.ts", "utf8");

  for (const price of [
    "30,000円〜",
    "100,000円〜",
    "300,000円〜",
    "30,000円 / 月〜",
  ]) {
    assert.match(content, new RegExp(price.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(content, /表示価格は税別です/);
  assert.match(
    content,
    /記載価格は目安です。対象業務、実装範囲、外部サービス連携、セキュリティ要件、導入支援等により料金は異なります。正式な料金は、対応範囲を確認した上でお見積りします。/,
  );
});

test("uses self-hosted web fonts and keeps indexing behind the contact gate", async () => {
  const [layout, tokens, env] = await Promise.all([
    readFile("app/layout.tsx", "utf8"),
    readFile("styles/tokens.css", "utf8"),
    readFile(".env.example", "utf8"),
  ]);

  assert.match(layout, /Inter, Noto_Sans_JP/);
  assert.match(layout, /next\/font\/google/);
  assert.doesNotMatch(tokens, /fonts\.googleapis\.com/);
  assert.match(env, /NEXT_PUBLIC_CONTACT_READY=false/);
});

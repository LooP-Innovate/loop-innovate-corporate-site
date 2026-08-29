import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { TOKUSHOHO_OPERATOR_CONFIG } from "../lib/site/legal-content.ts";

test("keeps unconfirmed commercial-transaction facts out of published config", () => {
  assert.equal(TOKUSHOHO_OPERATOR_CONFIG.sellerName, "未来創造工房 L∞P Innovate");
  assert.equal(TOKUSHOHO_OPERATOR_CONFIG.responsiblePerson, "三上 耕一");

  for (const key of [
    "address",
    "phone",
    "publicEmail",
    "paymentMethods",
    "cancellationTerms",
    "recurringCancellationDeadline",
    "stripeTerms",
  ]) {
    assert.equal(TOKUSHOHO_OPERATOR_CONFIG[key], null, `${key} must remain confirmation-gated`);
  }
});

test("publishes the complete trust and legal route contract", async () => {
  const [content, footer, route, css] = await Promise.all([
    readFile("lib/site/site-content.ts", "utf8"),
    readFile("components/site/SiteFooter.tsx", "utf8"),
    readFile("components/site/RoutePage.tsx", "utf8"),
    readFile("components/site/site.module.css", "utf8"),
  ]);

  assert.match(content, /"tokushoho"/);
  assert.match(content, /特定商取引法に基づく表記｜L∞P Innovate/);
  assert.match(content, /Privacy Policy[\s\S]*Terms of Use[\s\S]*特定商取引法に基づく表記[\s\S]*Legal/);
  assert.match(route, /TRUST_LEGAL_ROUTES/);
  assert.match(route, /<h3>/);
  assert.match(route, /legalDocumentLink/);
  assert.match(css, /@media print/);
  assert.match(footer, /2025–\$\{currentYear\}/);
  assert.match(footer, /All Rights Reserved\./);
  assert.doesNotMatch(footer, /未来創造工房 L∞P Innovate \/ Aomori/);
});

test("covers every required privacy and terms clause", async () => {
  const content = await readFile("lib/site/site-content.ts", "utf8");

  const privacyClauses = [
    "基本方針", "個人情報の定義", "取得する情報", "利用目的", "個人情報の取得方法",
    "第三者提供", "委託", "外部サービスの利用", "AI・生成AIサービス利用時の取扱い",
    "Cookie・アクセス解析", "安全管理措置", "保有個人データの開示・訂正・利用停止等",
    "保存期間", "未成年者", "本ポリシーの変更", "お問い合わせ窓口", "制定日・改定日",
  ];
  const termsClauses = [
    "適用", "サービス内容", "申込み・契約成立", "料金", "支払", "利用者の責任", "禁止事項",
    "知的財産権", "成果物の権利", "第三者サービス", "AI生成物・AI利用", "秘密保持", "個人情報",
    "保証の範囲", "免責", "契約解除", "サービス停止・変更", "損害賠償", "規約変更", "準拠法・管轄", "お問い合わせ",
  ];

  privacyClauses.forEach((clause, index) => {
    assert.match(content, new RegExp(`${index + 1}\\. ${clause}`));
  });
  termsClauses.forEach((clause, index) => {
    assert.match(content, new RegExp(`${index + 1}\\. ${clause}`));
  });
});

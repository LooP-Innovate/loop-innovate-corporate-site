/**
 * Facts that must be confirmed by the operator before they are published.
 * Keep unknown values as null: do not infer them from examples, old pages,
 * payment-provider defaults, or development configuration.
 */
export type TokushohoOperatorConfig = {
  publicationApproval: "pending" | "approved";
  sellerName: string;
  responsiblePerson: string;
  address: string | null;
  phone: string | null;
  publicEmail: string | null;
  paymentMethods: string | null;
  cancellationTerms: string | null;
  recurringCancellationDeadline: string | null;
  stripeTerms: string | null;
};

export const TOKUSHOHO_OPERATOR_CONFIG = {
  publicationApproval: "pending",
  sellerName: "未来創造工房 L∞P Innovate",
  responsiblePerson: "三上 耕一",
  address: null,
  phone: null,
  publicEmail: null,
  paymentMethods: null,
  cancellationTerms: null,
  recurringCancellationDeadline: null,
  stripeTerms: null,
} as const satisfies TokushohoOperatorConfig;

const TOKUSHOHO_REQUIRED_FACTS = [
  "address",
  "phone",
  "publicEmail",
  "paymentMethods",
  "cancellationTerms",
  "recurringCancellationDeadline",
  "stripeTerms",
] as const satisfies readonly (keyof TokushohoOperatorConfig)[];

const UNCONFIRMED_VALUE_PATTERN =
  /^(?:未定|確認中|要確認|null|undefined|pending|tbd|n\/?a|none|confirmed)$/i;

function isConfirmedFact(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= 4 &&
    !UNCONFIRMED_VALUE_PATTERN.test(value.trim())
  );
}

export function isTokushohoPublicationReady(
  config: TokushohoOperatorConfig = TOKUSHOHO_OPERATOR_CONFIG,
): boolean {
  if (config.publicationApproval !== "approved") {
    return false;
  }

  if (
    !config.publicEmail ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.publicEmail) ||
    !config.phone ||
    config.phone.replace(/\D/g, "").length < 9
  ) {
    return false;
  }

  return TOKUSHOHO_REQUIRED_FACTS.every((key) => {
    const value = config[key];
    return isConfirmedFact(value);
  });
}

export const LEGAL_DOCUMENT_DATES = {
  privacyPolicyEstablished: "2026年8月27日",
  privacyPolicyRevised: "2026年8月27日",
  termsEffective: "2026年8月27日",
  aiPolicyRevised: "2026年8月27日",
  securityRevised: "2026年8月27日",
} as const;

export const PENDING_PUBLICATION_NOTICE =
  "正式情報の確認後に掲載します。現在、本サイトからオンライン申込み・決済はできません。";

export const DISCLOSURE_ON_REQUEST_NOTICE =
  "住所および電話番号は、法令上表示を省略できる条件を満たす運用を確認した上で、請求があった場合に遅滞なく提供する方式、または公開表示のいずれかを採用します。現在は最終確認中です。";

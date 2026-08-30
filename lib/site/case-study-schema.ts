export type CaseStudyPublishStatus = "draft" | "review" | "published";
export type ClientDisclosurePermission =
  | "pending"
  | "anonymous-approved"
  | "named-approved";

export type CaseStudy = {
  title: string;
  industry: string;
  challenge: string;
  scope: readonly string[];
  solution: string;
  implementation: readonly string[];
  outcome: string;
  technologies: readonly string[];
  image: { src: string; alt: string } | null;
  publishStatus: CaseStudyPublishStatus;
  clientDisclosurePermission: ClientDisclosurePermission;
  verifiedMetrics: readonly { label: string; value: string; source: string }[];
};

/**
 * Only cases with explicit disclosure permission may be published. Numerical
 * outcomes must stay in verifiedMetrics and include their verification source.
 */
export function isCaseStudyPublishable(caseStudy: CaseStudy): boolean {
  return (
    caseStudy.publishStatus === "published" &&
    caseStudy.clientDisclosurePermission !== "pending" &&
    caseStudy.verifiedMetrics.every(
      (metric) =>
        metric.label.trim().length > 0 &&
        metric.value.trim().length > 0 &&
        metric.source.trim().length > 0,
    )
  );
}

export const FEATURED_CASE_STUDY = {
  title: "相談記録管理業務を、現場で運用できるWebアプリへ",
  industry: "福祉関連組織（匿名掲載）",
  challenge:
    "記録に加え、管理者確認、閲覧状況、集計、印刷までを一つの業務として扱う必要があった。",
  scope: ["要件整理", "業務フロー設計", "実装", "移行手順", "操作説明"],
  solution:
    "相談記録から確認・集計・出力までを一つの運用フローとして整理したWebアプリ。",
  implementation: [
    "管理者確認",
    "閲覧チェック",
    "月次集計",
    "CSV出力",
    "印刷・PDF保存を想定した表示",
    "来場者数管理",
  ],
  outcome:
    "実装範囲と運用導線を確認できる状態まで整備。効果数値は未検証のため掲載しない。",
  technologies: ["Google Apps Script", "Google Sheets"],
  image: null,
  publishStatus: "published",
  clientDisclosurePermission: "anonymous-approved",
  verifiedMetrics: [],
} as const satisfies CaseStudy;

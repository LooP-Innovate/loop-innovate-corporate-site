import {
  DISCLOSURE_ON_REQUEST_NOTICE,
  LEGAL_DOCUMENT_DATES,
  PENDING_PUBLICATION_NOTICE,
  TOKUSHOHO_OPERATOR_CONFIG,
} from "./legal-content";
import {
  FEATURED_CASE_STUDY,
  isCaseStudyPublishable,
} from "./case-study-schema";

const PUBLISHED_FEATURED_CASE_STUDY = isCaseStudyPublishable(
  FEATURED_CASE_STUDY,
)
  ? FEATURED_CASE_STUDY
  : null;

export const SITE_NAME = "L∞P Innovate";
export const SITE_METADATA_TITLE =
  "L∞P Innovate｜現場を、仕組みから変える。AI・業務改善・自動化";
export const SITE_DESCRIPTION =
  "青森県を拠点に、AI/DX、業務自動化、AIワークフロー・業務アプリ開発を支援。現場理解から要件整理、実装、導入・定着までつなぐL∞P Innovate。";

export const FOUNDER_PROFILE = {
  name: "三上 耕一",
  portrait: "/media/corporate/founder-koichi-mikami.webp",
  portraitAlt: "L∞P Innovate代表 三上耕一のプロフィール写真",
  experience: "福祉・介護の現場で20年以上",
  qualifications: ["社会福祉士", "介護福祉士"],
  visualFacts: [
    { label: "FIELD EXPERIENCE", value: "20+ years" },
    { label: "QUALIFICATION", value: "Social Worker" },
    { label: "QUALIFICATION", value: "Certified Care Worker" },
    { label: "PRACTICE", value: "ICT / Productivity" },
    { label: "IMPLEMENTATION", value: "AI / Workflow" },
    {
      label: "DELIVERY PATH",
      value: "Field → Requirement → Implementation",
    },
  ],
} as const;

export const SITE_ROUTE_SLUGS = [
  "about", "services", "ai-fde", "pricing", "case-studies", "faq",
  "contact", "security", "ai-policy", "privacy-policy", "terms", "legal",
  "tokushoho",
] as const;

export type SiteRouteSlug = (typeof SITE_ROUTE_SLUGS)[number];
export type NavigationItem = { label: string; href: `/${SiteRouteSlug}` | "/" };

export const PRIMARY_NAVIGATION = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "AI-FDE", href: "/ai-fde" },
  { label: "Case Study", href: "/case-studies" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
] as const satisfies readonly NavigationItem[];

export const FOOTER_NAVIGATION = [
  ...PRIMARY_NAVIGATION,
  { label: "Contact", href: "/contact" },
] as const satisfies readonly NavigationItem[];

export const POLICY_NAVIGATION = [
  { label: "Security", href: "/security" },
  { label: "AI Policy", href: "/ai-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "特定商取引法に基づく表記", href: "/tokushoho" },
  { label: "Legal", href: "/legal" },
] as const satisfies readonly NavigationItem[];

export const HOME_SERVICES = [
  { number: "01", title: "課題整理・AI/DX設計", english: "Discovery & Definition", description: "現状の業務、関係者、制約、情報の流れを整理し、「何を変えるべきか」を明確にします。" },
  { number: "02", title: "ワークフロー・業務アプリ実装", english: "System & Workflow", description: "AIワークフロー、自動化、RAG、業務アプリ等を組み合わせ、実際に使える形へ実装します。" },
  { number: "03", title: "導入・定着・改善支援", english: "Adoption & Improvement", description: "操作説明、マニュアル、軽微修正、運用確認まで、仕組みが現場で使われる状態へつなげます。" },
] as const;

export const HOME_PROCESS = [
  { id: "FIELD", label: "現場を捉える", description: "人、業務、課題、制約を理解する。" },
  { id: "ORDER", label: "課題を整理する", description: "情報と業務の流れを整理し、何を変えるべきかを明確にする。" },
  { id: "DESIGN", label: "仕組みを設計する", description: "人とAI、それぞれの役割を決め、業務として成立する形を設計する。" },
  { id: "BUILD", label: "使える形にする", description: "ワークフロー、アプリ、自動化を検証可能な形として実装する。" },
  { id: "ADOPT", label: "現場に定着させる", description: "実際の運用へ接続し、無理なく使える状態を整える。" },
  { id: "RETURN", label: "現場へ戻り、改善する", description: "利用結果を確認し、必要な部分を見直して次の改善へつなげる。" },
] as const;

export const HOME_FAQ = [
  { question: "何を準備して相談すればよいですか？", answer: "特別な資料は必要ありません。「時間がかかっている」「繰り返しが多い」「情報が散らばっている」など、今困っている業務を教えてください。" },
  { question: "AIやITに詳しくなくても大丈夫ですか？", answer: "問題ありません。専門用語を前提にせず、実際に使う人と現在の業務に合わせて整理します。" },
  { question: "福祉・介護以外でも相談できますか？", answer: "はい。福祉・介護は深い専門領域ですが、L∞P Innovateの中心は現場業務の整理と実装です。業種を問わず、AI・自動化・業務アプリ等の相談に対応します。" },
] as const;

export type RouteItem = {
  title: string;
  body?: string;
  price?: string;
  href?: `/${SiteRouteSlug}`;
};
export type RouteSection = {
  eyebrow: string;
  title: string;
  lead?: string;
  body?: string;
  note?: string;
  items: readonly RouteItem[];
};
export type SiteRouteContent = {
  slug: SiteRouteSlug;
  navLabel: string;
  metadataTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  introduction: string;
  sections: readonly RouteSection[];
  notice?: string;
};

export const SITE_ROUTE_CONTENT = {
  about: {
    slug: "about", navLabel: "About", metadataTitle: "私たちについて｜L∞P Innovate",
    metaDescription: "福祉・介護現場20年以上の実務経験とAI・業務改善をつなぐL∞P Innovateの考え方、代表プロフィール、FIELD LOOP、事業情報を紹介します。",
    eyebrow: "ABOUT / FIELD EXPERIENCE", title: "私たちについて",
    lead: "L∞P Innovateは、現場理解と実装を分離しません。人・業務・制度・技術の間に入り、課題を整理し、仕組みに変え、使われるところまで接続するための事業です。",
    introduction: "現場を知っているから、仕組みだけでは変わらないことを知っている。",
    sections: [
      { eyebrow: "FOUNDER / FIELD EXPERIENCE", title: "現場理解を、実装へつなぐ。", body: `代表の${FOUNDER_PROFILE.name}は、${FOUNDER_PROFILE.experience}、生活相談・介護業務、利用者や家族への対応、関係職種との調整、会議・記録・情報共有に携わってきました。近年はICT・生産性向上の取り組みとして、介護テクノロジーの導入検討、委員会運営、説明資料や会議録の整備にも関わっています。L∞P Innovateは、その現場理解をAI・自動化・アプリ開発へつなぐために生まれました。`, items: [
        { title: "20年以上の福祉・介護実務" }, { title: "ICT・生産性向上の検討・委員会運営" }, { title: "社会福祉士 / 介護福祉士" },
      ] },
      { eyebrow: "01 / POSITIONING", title: "現場の言葉を、要件と実装へ。", body: "現場で起きていることを、そのまま開発仕様へ置き換えることはできません。業務を理解し、問題を分解し、優先順位をつけ、人と技術の役割を決める必要があります。L∞P Innovateは、現場と開発のあいだに立ち、その翻訳と実装を担います。", items: [
        { title: "現場理解から開始" }, { title: "要件整理から実装へ" }, { title: "導入・運用まで接続" },
      ] },
      { eyebrow: "02 / PRINCIPLES", title: "判断原則", items: [
        { title: "Human-centered", body: "使う人の能力や経験に合わせるのではなく、仕組みの側を現場へ合わせる。" },
        { title: "Real-world", body: "デモで動くことより、日々の業務で無理なく使えることを優先する。" },
        { title: "Responsible technology", body: "AIの出力をそのまま正解にせず、人の確認、データの扱い、権限、責任の所在まで含めて設計する。" },
      ] },
      { eyebrow: "03 / COMPANY FACTS", title: "事業情報", body: "AIを調査・設計・開発・QA・ドキュメント制作等の業務基盤として活用し、少人数でも高密度に進めます。一方で、重要な判断、顧客との合意、個人情報・機密情報、最終確認は人が責任を持ちます。", items: [
        { title: "屋号", body: "未来創造工房 L∞P Innovate" }, { title: "代表", body: FOUNDER_PROFILE.name },
        { title: "事業形態 / 開業", body: "個人事業 / 2025年4月" }, { title: "拠点", body: "青森県" },
        { title: "資格", body: FOUNDER_PROFILE.qualifications.join(" / ") }, { title: "主な領域", body: "AI/DX支援、AI-FDE、業務自動化、AIワークフロー、業務アプリ、Web、導入・定着支援" },
      ] },
    ],
  },
  services: {
    slug: "services", navLabel: "Services", metadataTitle: "サービス｜AI・業務改善・自動化・業務アプリ開発｜L∞P Innovate",
    metaDescription: "AI/DX設計、業務フロー整理、GAS・n8n・Dify等を活用した自動化、RAG、AI Agent、業務アプリ、導入・定着支援まで対応します。",
    eyebrow: "SERVICES / FIELD TO DELIVERY", title: "事業・支援領域", lead: "構想だけでも、開発だけでも終わらせない。現場理解から要件整理、設計、実装、導入・定着まで、必要な工程をつなげて支援します。", introduction: "課題の整理から、現場で使える状態まで。",
    sections: [
      { eyebrow: "01 / DISCOVERY & DEFINITION", title: "構想・要件整理", body: "対象業務、関係者、制約、情報の流れを整理し、「何を変えるか」と「どこまで作るか」を明確にします。", items: [
        { title: "対応内容", body: "現場ヒアリング / 業務フロー可視化 / 課題・ボトルネック整理 / AI活用可能性の検討 / 優先順位・PoC範囲設定 / 業務要件・システム要件整理 / 既存ツール・運用条件の確認" },
        { title: "主な成果物", body: "課題整理 / 業務フロー / 要件一覧 / 実装方針 / 検証計画" },
      ] },
      { eyebrow: "02 / EXPERIENCE & SYSTEM DESIGN", title: "体験・業務設計", body: "人が判断する部分と、AI・自動化へ任せる部分を分け、現場で迷わず使える業務フローとして設計します。", items: [
        { title: "対応内容", body: "AI Workflow / Human-in-the-loop / RAG・ナレッジ検索 / AI Agent / UI・確認フロー / データ・権限・セキュリティ / Web・情報設計" },
        { title: "技術例", body: "Google Workspace / GAS / n8n / Dify / RAG / Web Application / 生成AI API 等" },
        { title: "選定方針", body: "技術は案件に合わせて選択し、特定製品の導入自体を目的にしません。" },
      ] },
      { eyebrow: "03 / BUILD & ADOPTION", title: "実装・導入支援", body: "検証可能な形へ実装し、必要に応じて操作説明・マニュアル・運用調整までつなぎます。", items: [
        { title: "実装", body: "AIワークフロー / 業務自動化 / 小規模業務アプリ・Webアプリ / 会議・記録・報告業務 / FAQ・ナレッジ検索 / Webサイト・LP" },
        { title: "導入・定着", body: "テスト・検証 / 導入・移行支援 / 操作マニュアル / オンライン操作説明 / 軽微修正・運用確認 / AIリテラシー支援" },
      ] },
      { eyebrow: "DOMAIN FOCUS / WELFARE & CARE", title: "深い現場理解を持つ領域", body: "福祉・介護は、L∞P Innovateが特に深い現場理解を持つ領域です。生活相談、介護、家族対応、多職種連携、記録、会議、ICT・生産性向上、介護テクノロジー等の実務理解を背景に、現場の言葉から要件を整理できます。福祉専業ではなく、業種を問わず現場業務を持つ企業・組織の改善を対象とします。", items: [
        { title: "専門領域", body: "福祉・介護の業務改善 / ICT・DX" }, { title: "対象", body: "一般企業・地域組織を含む、現場業務を持つ企業・組織" },
      ] },
    ],
  },
  "ai-fde": {
    slug: "ai-fde", navLabel: "AI-FDE", metadataTitle: "AI-FDE｜現場理解から実装・定着まで｜L∞P Innovate",
    metaDescription: "L∞P InnovateのAI-FDEは、現場理解、要件整理、設計、実装、導入、改善を一つの流れで扱う現場型AI実装支援モデルです。",
    eyebrow: "AI-FDE / DELIVERY MODEL", title: "AI-FDE", lead: "現場の課題を理解し、必要な仕組みを設計・実装し、使える状態までつなげる、L∞P Innovateの現場密着型AI実装支援モデルです。", introduction: "現場と開発の距離を、実装で埋める。",
    sections: [
      { eyebrow: "01 / DEFINITION", title: "AI-FDEとは", lead: "現場の課題を理解し、必要な仕組みを設計し、実装し、使える状態までつなげる支援の進め方です。", body: "「AIを導入すること」から始めるのではなく、まず今の業務を理解し、どこを変えるべきかを整理します。必要に応じてAI・自動化・業務アプリを組み合わせ、導入後の運用や改善まで一つの流れとして支援します。", note: "L∞P Innovateでは、この現場密着型の支援モデルを「AI-FDE」と呼んでいます。業界標準、資格、公的名称を示すものではありません。", items: [
        { title: "現場理解", body: "現場で何が起きているかを理解し、問題を業務要件へ翻訳する。" },
        { title: "設計・実装", body: "AIと人の役割を設計し、必要な仕組みを試作・実装する。" },
        { title: "検証・改善", body: "実際に使って検証し、運用結果を次の改善へ戻す。" },
        { title: "対象になりやすい状況", body: "始め方が分からない / 現場と開発の認識が合わない / PoCが定着しない / ツールが増えて業務全体が未整理 / 小さな改善を実装まで進めたい" },
      ] },
      { eyebrow: "02 / PHILOSOPHY INTO DELIVERY", title: "FIELD LOOPを、実務の進め方へ", body: "FIELD LOOPは、現場を起点に改善を循環させる思想です。AI-FDEは、その思想を実際のプロジェクトでどう支援するかを表すDelivery Modelです。", items: [
        { title: "FIELD — 現場を捉える", body: "実際の業務、人、情報、制約を確認する。" },
        { title: "ORDER — 課題を整理する", body: "問題を分解し、優先順位と改善対象を明確にする。" },
        { title: "DESIGN — 仕組みを設計する", body: "人とAIの役割、データ、画面、業務フローを設計する。" },
        { title: "BUILD — 使える形にする", body: "小さく検証できる形から実装する。" },
        { title: "ADOPT — 現場に定着させる", body: "操作説明、ルール、移行、利用確認を含めて運用へ接続する。" },
        { title: "RETURN — 現場へ戻り、改善する", body: "利用結果を確認し、次の改善へ反映する。" },
      ] },
      { eyebrow: "03 / GOVERNANCE", title: "責任ある実装", body: "AIを使うからこそ、「自動化できるか」だけではなく、「自動化してよいか」を確認します。", items: [
        { title: "Human oversight", body: "重要な判断をAIだけに委ねず、業務上の責任を持つ人が確認できる設計を基本とします。" },
        { title: "Data handling", body: "必要な情報だけを扱い、案件に応じて匿名化、最小化、権限制御等を検討します。" },
        { title: "Evaluation", body: "重要な情報や判断は、一次情報・業務ルール・人による確認へ接続します。" },
        { title: "Security", body: "本番・開発環境、権限、外部サービスへの送信範囲と責任分担を明確にします。" },
      ] },
    ],
  },
  pricing: {
    slug: "pricing", navLabel: "Pricing", metadataTitle: "料金の考え方｜L∞P Innovate", metaDescription: "課題整理、小規模検証、個別実装、継続支援など、L∞P Innovateへの依頼方法と見積りを決める考え方を紹介します。",
    eyebrow: "PRICING / SCOPE BEFORE PRICE", title: "料金の考え方", lead: "価格を先に当てはめるのではなく、改善対象と必要な範囲を揃えてから見積もります。", introduction: "必要なものだけを、必要な規模から。",
    sections: [
      { eyebrow: "01 / REQUEST TYPES", title: "依頼の形と料金目安", body: "最初から大規模な構築を前提にせず、課題と予算に合わせて段階を決めます。表示価格は税別です。", items: [
        { title: "FIELD SESSION", price: "30,000円〜", body: "課題を整理するところから。現状ヒアリング / 業務フロー整理 / 課題整理 / 優先順位 / AI活用可能性 / 次の進め方。" },
        { title: "PoC / PROTOTYPE", price: "100,000円〜", body: "小さく試して、確かめる。AI Workflow / Automation / RAG / 簡易アプリ / 技術検証 / 運用検証。" },
        { title: "PROJECT BUILD", price: "300,000円〜", body: "実際に使える仕組みへ。要件整理 / 設計 / 開発 / テスト / 移行 / マニュアル / 操作説明。" },
        { title: "CONTINUOUS SUPPORT", price: "30,000円 / 月〜", body: "使いながら、改善する。運用相談 / 軽微修正 / Workflow改善 / AI活用相談 / 継続的改善。" },
      ] },
      { eyebrow: "02 / COST DRIVERS", title: "見積りを決める要素", body: "固定料金を無理に当てはめず、見積時に「含むもの / 含まないもの」を明確にします。", items: [
        { title: "Scope", body: "対象業務と実装範囲" }, { title: "Complexity", body: "画面、処理、条件分岐、データ量" },
        { title: "Integration", body: "Google Workspace、外部API、既存システム等との連携" }, { title: "Security", body: "個人情報、権限、環境分離等の要件" },
        { title: "Delivery", body: "移行、マニュアル、操作説明、保守の範囲" },
      ] },
      { eyebrow: "03 / ESTIMATE FLOW", title: "ご相談から開始まで", items: [
        { title: "1. 相談内容を確認" }, { title: "2. 現状と改善したい業務を整理" }, { title: "3. 対応範囲と成果物を定義" }, { title: "4. 見積・条件を提示" }, { title: "5. 合意後に着手" },
      ] },
    ],
    notice: "記載価格は目安です。対象業務、実装範囲、外部サービス連携、セキュリティ要件、導入支援等により料金は異なります。正式な料金は、対応範囲を確認した上でお見積りします。",
  },
  "case-studies": {
    slug: "case-studies", navLabel: "Case Study", metadataTitle: "事例｜L∞P Innovate", metaDescription: "L∞P Innovateが実際に担当した業務改善・アプリ開発・導入支援を、課題、担当範囲、成果物、運用設計が分かる形で紹介します。",
    eyebrow: "CASE STUDY / VERIFIED WORK", title: "事例", lead: "成果を大きく見せるための事例ではなく、実際に担当した課題、実装範囲、成果物、運用設計が確認できるものを掲載します。", introduction: PUBLISHED_FEATURED_CASE_STUDY?.title ?? "公開条件を確認した事例のみ掲載します。",
    sections: [
      ...(PUBLISHED_FEATURED_CASE_STUDY
        ? [
            {
              eyebrow: "CASE 01 / ANONYMOUS DISCLOSURE",
              title: PUBLISHED_FEATURED_CASE_STUDY.title,
              body: `${PUBLISHED_FEATURED_CASE_STUDY.industry}。${PUBLISHED_FEATURED_CASE_STUDY.solution}`,
              items: [
                { title: "課題", body: PUBLISHED_FEATURED_CASE_STUDY.challenge },
                { title: "担当範囲", body: PUBLISHED_FEATURED_CASE_STUDY.scope.join(" / ") },
                { title: "実装", body: PUBLISHED_FEATURED_CASE_STUDY.implementation.join(" / ") },
                { title: "技術", body: PUBLISHED_FEATURED_CASE_STUDY.technologies.join(" / ") },
                { title: "Outcome", body: PUBLISHED_FEATURED_CASE_STUDY.outcome },
              ],
            },
          ]
        : []),
      { eyebrow: "EDITORIAL POLICY", title: "事例の掲載方針", items: [
        { title: "実際に担当した内容だけを掲載する" }, { title: "担当範囲を明確にする" }, { title: "数値は検証可能な場合だけ掲載する" },
        { title: "顧客名・ロゴは公開許諾を確認する" }, { title: "匿名案件は業種・課題・成果物を中心に紹介する" }, { title: "提案例やデモは実績と明確に区別する" },
      ] },
    ],
    notice: "顧客名、定量成果、内部情報は、公開許諾または検証可能性が確認できないものを掲載しません。",
  },
  faq: {
    slug: "faq", navLabel: "FAQ", metadataTitle: "よくある質問｜L∞P Innovate", metaDescription: "AI・業務改善の相談、対応範囲、料金、納期、オンライン対応、個人情報、AI利用、導入後サポートに関する質問をまとめています。",
    eyebrow: "FAQ / PRACTICAL QUESTIONS", title: "よくある質問", lead: "相談前、進め方、料金、AI利用、セキュリティについて、よく確認される内容をまとめています。", introduction: "まずは、困っている業務から。",
    sections: [
      { eyebrow: "01 / BEFORE CONTACT", title: "相談前の質問", items: [
        { title: "相談前に何を準備すればよいですか？", body: "特別な資料は必要ありません。まずは「時間がかかっている」「繰り返しが多い」「情報が整理しづらい」など、困っている業務を一つ教えてください。" },
        { title: "相談内容がまだ曖昧でも大丈夫ですか？", body: "大丈夫です。「AIを使いたいが何ができるか分からない」という段階でも、業務を整理しながら改善対象を探します。" },
        { title: "AIやITに詳しくなくても大丈夫ですか？", body: "問題ありません。専門用語を前提にせず、実際に使う方の業務やスキルに合わせて設計します。" },
        { title: "福祉・介護以外も対応していますか？", body: "対応します。福祉・介護は特に深い専門領域ですが、中心は現場業務の整理と実装です。一般企業・地域組織等の業務改善も対象です。" },
      ] },
      { eyebrow: "02 / DELIVERY", title: "提供・進行の質問", items: [
        { title: "小さな業務だけでも相談できますか？", body: "可能です。一つの記録、一つの集計、一つのワークフローなど、改善効果を確認しやすい単位から始める方法を重視しています。" },
        { title: "どのように対応範囲を決めますか？", body: "現状、利用者、既存ツール、データ、連携、セキュリティ、予算等を確認し、必要な範囲を整理します。" },
        { title: "どれくらいの期間がかかりますか？", body: "内容によって異なります。要件整理後に、対応範囲とあわせてスケジュールをご提示します。固定的な短納期は約束しません。" },
        { title: "納品後のサポートはありますか？", body: "案件に応じて対応します。初期不具合・軽微修正、操作相談、運用改善等は、見積・契約時に対応範囲を明確にします。" },
        { title: "オンラインでも対応できますか？", body: "はい。青森県を拠点としていますが、ヒアリング、操作説明、打ち合わせ等はオンラインでも対応可能です。" },
      ] },
      { eyebrow: "03 / SECURITY & AI", title: "セキュリティとAIの質問", items: [
        { title: "個人情報や機密情報を扱う相談もできますか？", body: "案件内容を確認した上で、データの最小化、匿名化、権限、保存場所、本番環境と検証環境の分離等を検討します。外部AIサービスへ無条件に機密情報を入力する設計は行いません。" },
        { title: "L∞P Innovate自身もAIを使っていますか？", body: "はい。調査、整理、設計、開発補助、QA、文書作成等にAIを活用しています。ただし重要な判断、顧客との合意、個人情報・機密情報、最終確認は人が責任を持ちます。" },
        { title: "AIの回答をそのまま業務判断に使いますか？", body: "重要な判断をAIだけに委ねることを前提にはしません。AIの出力は誤る可能性があるため、人による確認や一次情報との照合を組み込む設計を基本とします。" },
        { title: "料金はどのように決まりますか？", body: "FIELD SESSIONは30,000円〜、PoC / Prototypeは100,000円〜、Project Buildは300,000円〜、継続支援は30,000円 / 月〜が税別の目安です。対象業務、実装範囲、連携、セキュリティ要件、導入支援等を確認して正式に見積もります。" },
      ] },
    ],
  },
  contact: {
    slug: "contact", navLabel: "Contact", metadataTitle: "お問い合わせ｜L∞P Innovate", metaDescription: "AI導入、業務自動化、業務アプリ、Web、福祉・介護DXなどのご相談はこちら。要件が固まる前の段階からご相談いただけます。",
    eyebrow: "CONTACT / START FROM THE PROBLEM", title: "お問い合わせ", lead: "要件が決まっていなくても構いません。困っている業務や、変えたいことからお聞かせください。", introduction: "「何を作るか」より先に、「何に困っているか」から。",
    sections: [
      { eyebrow: "01 / CONSULTATION", title: "ご相談いただけること", body: "AI導入、業務自動化、業務アプリ、Web、福祉・介護DXなど、まだ解決方法が決まっていない段階でも相談できます。", items: [
        { title: "記録・集計・会議後の作業を減らしたい" }, { title: "AIをどこに使えばよいか整理したい" }, { title: "Excel / Google Workspace中心の業務を見直したい" },
        { title: "小さな業務アプリを作りたい" }, { title: "PoCから実運用へ進めたい" }, { title: "福祉・介護現場のICT / DXについて相談したい" },
      ] },
      { eyebrow: "02 / CONTACT DETAILS", title: "受付に必要な項目", body: "送信機能を接続する際は、以下の必須項目とプライバシーポリシーへの同意を受付条件とします。", items: [
        { title: "必須", body: "お名前 / 会社・組織名（個人の場合は「個人」） / メールアドレス / ご相談内容 / プライバシーポリシーへの同意" },
        { title: "任意", body: "ご相談カテゴリ / 希望時期 / 参考資料・URL" },
      ] },
      { eyebrow: "03 / NEXT STEP", title: "ご相談から開始まで", items: [
        { title: "1. お問い合わせ内容を確認" }, { title: "2. 必要に応じてオンラインで現状をヒアリング" }, { title: "3. 対応範囲・成果物・進め方を整理" }, { title: "4. 見積・条件をご提示" }, { title: "5. 合意後に開始" },
      ] },
    ],
    notice: "現在、このサイトには問い合わせ送信機能が接続されていません。誤送信を避けるため、入力フォームは公開していません。送信先の確定後に、必要最小限の項目で接続します。",
  },
  security: {
    slug: "security", navLabel: "Security", metadataTitle: "セキュリティ｜L∞P Innovate", metaDescription: "データ最小化、権限、本番・検証環境、責任分担など、L∞P InnovateがAI・業務アプリ開発で重視するセキュリティ方針を紹介します。",
    eyebrow: "SECURITY / DESIGN CONDITION", title: "セキュリティ", lead: "安全性を、実装後に追加する機能ではなく、最初から確認する設計条件として扱います。", introduction: "扱う情報と責任の境界を、先に明確にする。",
    sections: [
      { eyebrow: "01 / GOVERNANCE", title: "管理の基本", body: "個人情報保護法上の安全管理措置の考え方を踏まえ、案件の規模、情報の性質、利用サービス、責任分担に応じて必要な管理を定めます。", items: [
        { title: "アクセス権限", body: "利用者・開発者・管理者の役割を分け、業務に必要な範囲で権限を設定します。利用者の追加・削除や契約終了時の権限整理は、発注者と管理主体を確認して行います。" },
        { title: "認証・パスワード", body: "利用サービスが提供する認証機能を確認し、パスワードや認証情報を共有文書、公開リポジトリ、AI入力へ含めない運用を基本とします。" },
        { title: "端末・アカウント", body: "業務用アカウントの共有を避け、端末、ブラウザセッション、APIキー等の管理主体を案件ごとに明確にします。" },
      ] },
      { eyebrow: "02 / DATA HANDLING", title: "データを必要最小限にする", items: [
        { title: "Data minimization", body: "目的に不要な個人情報・機密情報を収集、複製、外部送信しません。検証では可能な範囲でダミーデータ、匿名化・一般化した情報を使用します。" },
        { title: "Environment separation", body: "情報の性質と案件条件に応じ、本番・検証環境の分離、本番データを用いない検証、共有範囲の限定を検討します。" },
        { title: "送信範囲", body: "外部API、SaaS、生成AIへ送る項目、保存の有無、利用者、権限、ログの扱いを確認し、必要な範囲だけを接続します。" },
      ] },
      { eyebrow: "03 / SERVICES & CONTINUITY", title: "外部サービスと継続性", items: [
        { title: "サービス選定・委託先管理", body: "取扱情報、利用規約、データ利用方針、権限機能、保存場所、事故時の連絡手段等を確認し、案件条件に適合するサービスを選びます。個人データを委託する場合は、必要な契約・監督を行います。" },
        { title: "バックアップ", body: "データの重要度、復旧要件、利用基盤の機能、費用を確認し、バックアップの要否、保存先、保持期間、復旧担当を個別に定めます。すべての案件で同一のバックアップを保証するものではありません。" },
        { title: "不正アクセス対策", body: "公開範囲、権限、認証、ソフトウェア更新、秘密情報の保管、ログ確認等から、対象システムに必要な対策を選定します。" },
      ] },
      { eyebrow: "04 / INCIDENT & REVIEW", title: "問題発生時と見直し", body: "漏えい、不正アクセス、誤送信、アカウント侵害等の懸念を把握した場合は、事実、影響範囲、対象データ、利用サービス、責任分担を確認し、停止・権限変更・連絡等の必要な対応を検討します。", items: [
        { title: "共同で確認する事項", body: "発注者側アカウントや利用者管理など、L∞P Innovateだけでは完結しない管理があります。契約・設計・引渡し時に、管理主体と連絡経路を確認します。" },
        { title: "改定日", body: `最終改定日：${LEGAL_DOCUMENT_DATES.securityRevised}` },
      ] },
    ],
  },
  "ai-policy": {
    slug: "ai-policy", navLabel: "AI Policy", metadataTitle: "AI利用方針｜L∞P Innovate", metaDescription: "L∞P InnovateにおけるAIの利用範囲、データの扱い、人による確認、責任あるAI活用の基本方針を紹介します。",
    eyebrow: "AI POLICY / RESPONSIBLE USE", title: "AI利用方針", lead: "L∞P InnovateはAIを積極的に活用します。同時に、AIに任せる範囲と、人が責任を持つ範囲を明確にします。", introduction: "AIは目的ではなく、業務を支える手段。",
    sections: [
      { eyebrow: "01 / PURPOSE", title: "利用目的", body: "AIは、調査、情報整理、設計、開発補助、QA、文書作成等に活用します。ただし、AIを使うこと自体を成果とは考えません。導入の可否は、業務上の目的、精度、コスト、セキュリティ、運用負荷を見て判断します。", items: [] },
      { eyebrow: "02 / DATA & SERVICES", title: "データと外部AIサービス", items: [
        { title: "Data minimization", body: "個人情報・機密情報は利用目的と必要性を確認し、必要に応じて匿名化・一般化・最小化します。顧客案件の情報を無条件に外部AIへ入力しません。" },
        { title: "Confidential information", body: "パスワード、認証情報、秘密鍵等はAI入力の対象にしません。NDA、個別契約、発注者のセキュリティ方針がある場合は、その条件を優先します。" },
        { title: "External AI services", body: "利用サービス、外部送信範囲、提供者によるデータ利用、保存・学習設定、権限、利用地域等を案件に応じて確認します。すべての情報がAIへ送信される設計は行いません。" },
      ] },
      { eyebrow: "03 / OVERSIGHT & EVALUATION", title: "最終判断は、人が持つ。", body: "AIの出力には誤り、不完全さ、偏りが含まれる可能性があります。", items: [
        { title: "Human oversight", body: "重要な情報は一次情報と照合し、顧客へ提出する成果物は人が確認します。契約、法務、医療、福祉等の専門判断をAIだけで代替しません。" },
        { title: "Evaluation", body: "用途に応じて、正確性、再現性、安全性、権限、失敗時の影響を確認します。AIが生成したコード、文章、分類結果等も必要なテストとレビューを行います。" },
        { title: "Human-in-the-loop", body: "自動化の影響が大きい工程では、人が確認・修正・停止できる流れを設計します。" },
      ] },
      { eyebrow: "04 / SECURITY & REVISION", title: "セキュリティと見直し", items: [
        { title: "Security", body: "AI利用時もSecurityおよびPrivacy Policyの方針を適用し、データ量、送信先、アクセス権限、保存、責任分担を確認します。" },
        { title: "改定日", body: `最終改定日：${LEGAL_DOCUMENT_DATES.aiPolicyRevised}` },
      ] },
    ],
  },
  "privacy-policy": {
    slug: "privacy-policy", navLabel: "Privacy Policy", metadataTitle: "プライバシーポリシー｜L∞P Innovate", metaDescription: "未来創造工房 L∞P Innovateによる、本ウェブサイトと事業活動における情報の取扱い方針です。",
    eyebrow: "PRIVACY / WEBSITE POLICY", title: "プライバシーポリシー", lead: "未来創造工房 L∞P Innovateは、事業活動および本ウェブサイトを通じて取得する情報を、利用目的の範囲内で適切に取り扱います。", introduction: "実際のデータフローに基づき、必要な範囲だけを記載します。",
    sections: [
      { eyebrow: "01 / SCOPE & DEFINITION", title: "方針と対象", items: [
        { title: "1. 基本方針", body: "未来創造工房 L∞P Innovate（以下「当事業」といいます。）は、個人情報の保護に関する法律その他の関係法令を遵守し、事業活動および本サイトで取り扱う情報を、利用目的の範囲内で適切に管理します。" },
        { title: "2. 個人情報の定義", body: "本ポリシーにおける個人情報は、氏名、住所、連絡先その他の記述等により特定の個人を識別できる情報、および個人識別符号が含まれる情報をいいます。" },
      ] },
      { eyebrow: "02 / COLLECTION", title: "取得する情報と方法", items: [
        { title: "3. 取得する情報", body: "お問い合わせ、見積、契約、支援、保守等に伴い、氏名、メールアドレス、会社・団体名、電話番号、問い合わせ内容、契約・請求・納品に必要な情報、打合せ記録、提供資料、利用環境等を取得することがあります。必要のない情報を一律に求めるものではありません。" },
        { title: "4. 利用目的", body: "お問い合わせへの対応、本人確認、提案・見積、契約・請求・納品、AIコンサルティング、DX・業務改善支援、AI Workflow・RAG・業務アプリ・Web等の設計開発、操作説明・保守・サポート、品質・サービス改善、セキュリティ確保、不正利用防止、法令・契約上必要な対応に利用します。" },
        { title: "5. 個人情報の取得方法", body: "フォーム、電子メール、オンライン会議、契約書類、顧客からの資料提供、サービス利用時の記録等、適法かつ公正な方法で取得します。要配慮個人情報を取得する場合は、法令上認められる場合を除き、あらかじめ本人の同意を得ます。" },
      ] },
      { eyebrow: "03 / SHARING & PROCESSORS", title: "提供・委託・外部サービス", items: [
        { title: "6. 第三者提供", body: "本人の同意がある場合、法令に基づく場合、生命・身体・財産の保護等のために必要で本人同意を得ることが困難な場合その他法令で認められる場合を除き、個人データを第三者へ提供しません。" },
        { title: "7. 委託", body: "利用目的の達成に必要な範囲で、クラウド、ホスティング、会計、決済、連絡、開発支援等の事業者へ取扱いを委託することがあります。委託先の選定、契約、権限、取扱状況等を必要に応じて確認します。" },
        { title: "8. 外部サービスの利用", body: "案件や運用に応じて、クラウド、SaaS、外部API等を利用することがあります。利用目的、送信項目、保存、権限、提供者の条件、国外取扱いの有無等を確認し、必要最小限の情報を扱います。国外で個人データを取り扱う場合は、適用法令に従い必要な対応を行います。" },
        { title: "9. AI・生成AIサービス利用時の取扱い", body: "外部AIサービスを利用する場合がありますが、顧客情報を一律に送信するものではありません。案件条件と情報の性質を確認し、必要に応じて匿名化・一般化・最小化し、個人情報・機密情報・認証情報を不要に入力しません。重要な出力は人が確認します。" },
      ] },
      { eyebrow: "04 / WEBSITE & SECURITY", title: "サイト利用と安全管理", items: [
        { title: "10. Cookie・アクセス解析", body: "現在、本サイトにはアクセス解析、広告Cookie、Cookie同意管理を接続していません。サーバー運用上、IPアドレス、User-Agent、アクセス日時等が一時的なログとして記録される場合があります。解析・広告ツールを追加する場合は、送信先と目的を確認し本ポリシーを更新します。" },
        { title: "11. 安全管理措置", body: "基本方針の整備、取扱範囲と責任者の確認、アクセス権限・認証情報の管理、必要最小限のデータ利用、端末・アカウント管理、外部サービスの選定、送信範囲の確認、案件に応じたバックアップ・復旧方法、不正アクセス対策、委託先管理等を、取扱情報とリスクに応じて実施します。具体的内容の一部は、安全管理上支障のない範囲で本人の求めに応じて回答します。" },
      ] },
      { eyebrow: "05 / RIGHTS & RETENTION", title: "本人の権利と保存", items: [
        { title: "12. 保有個人データの開示・訂正・利用停止等", body: "本人または正当な代理人から、利用目的の通知、開示、訂正・追加・削除、利用停止・消去、第三者提供停止等の請求を受けた場合、本人確認の上、法令に従い遅滞なく対応します。法令上応じられない場合は、可能な範囲で理由を説明します。" },
        { title: "13. 保存期間", body: "利用目的、契約・請求・税務等の法令、紛争対応、バックアップの性質を踏まえ必要な期間だけ保存し、不要となった情報は安全な方法で削除または匿名化します。個別契約に保存期間の定めがある場合は、その条件を優先します。" },
        { title: "14. 未成年者", body: "未成年者から個人情報を取得する場合は、内容や法令に応じて保護者等の同意を確認します。未成年者は、必要に応じて保護者とともにお問い合わせください。" },
      ] },
      { eyebrow: "06 / REVISION & CONTACT", title: "変更・窓口・日付", items: [
        { title: "15. 本ポリシーの変更", body: "法令、事業内容、利用サービス、サイト機能の変更に応じて本ポリシーを改定します。重要な変更は本サイト上で分かりやすく公表します。" },
        { title: "16. お問い合わせ窓口", body: "個人情報の取扱い、開示等の請求、苦情はContactページからご連絡ください。現在はサイト内送信機能の接続前であり、正式な公開メールアドレスは確認後に掲載します。" },
        { title: "17. 制定日・改定日", body: `制定日：${LEGAL_DOCUMENT_DATES.privacyPolicyEstablished} ／ 最終改定日：${LEGAL_DOCUMENT_DATES.privacyPolicyRevised}` },
      ] },
    ],
  },
  terms: {
    slug: "terms", navLabel: "Terms", metadataTitle: "利用規約｜L∞P Innovate", metaDescription: "未来創造工房 L∞P Innovateが運営する本ウェブサイトの利用条件です。",
    eyebrow: "TERMS / WEBSITE USE", title: "利用規約", lead: "本規約は、未来創造工房 L∞P Innovateが運営する本ウェブサイトの利用条件を定めるものです。個別のコンサルティング、開発、保守等の条件は、見積書・契約書・発注確認等の個別合意を優先します。", introduction: "サイト利用条件と、個別案件の契約条件を分けて扱います。",
    sections: [
      { eyebrow: "01 / SCOPE & CONTRACT", title: "適用と契約", items: [
        { title: "1. 適用", body: "本規約は、本サイトの閲覧、問い合わせ、相談、見積その他契約成立前のやり取りに適用します。コンサルティング、開発、保守等の個別契約、NDA、見積書、発注確認等と本規約が異なる場合は、個別の合意を優先します。" },
        { title: "2. サービス内容", body: "当事業は、AIコンサルティング、DX・業務改善、AI Workflow、RAG、業務自動化、業務アプリ・Webの設計開発、導入・定着支援等を、案件ごとに合意した範囲で提供します。" },
        { title: "3. 申込み・契約成立", body: "問い合わせや見積依頼のみでは契約は成立しません。当事業が提供範囲、料金、日程その他の条件を提示し、双方が書面または電磁的方法で合意した時点で個別契約が成立します。" },
      ] },
      { eyebrow: "02 / PRICE & PAYMENT", title: "料金と支払", items: [
        { title: "4. 料金", body: "料金は、サービスページ、見積書、申込画面または個別契約に表示します。追加作業が必要な場合は、内容と費用を確認し、合意なく範囲を拡大しません。" },
        { title: "5. 支払", body: "支払方法、支払時期、税、振込手数料その他の条件は、申込画面、請求書または個別契約に定めます。正式に対応する支払方法は、提供開始前に明示します。" },
      ] },
      { eyebrow: "03 / USER RESPONSIBILITY", title: "利用者の責任と禁止事項", items: [
        { title: "6. 利用者の責任", body: "利用者は、提供するデータ、文章、画像、ソフトウェア、アカウント等について、利用・提供する権限と適法性を確認し、正確な情報と必要な協力を提供するものとします。" },
        { title: "7. 禁止事項", body: "法令・公序良俗違反、不正アクセス、認証情報の不正利用、第三者の知的財産権・プライバシーその他の権利侵害、マルウェア送信、サービス妨害、AIや成果物を用いた詐欺・差別・危険行為その他不正利用を禁止します。" },
      ] },
      { eyebrow: "04 / RIGHTS & SERVICES", title: "権利と外部サービス", items: [
        { title: "8. 知的財産権", body: "本サイトの文章、デザイン、画像、ロゴ、プログラム等の権利は、当事業または正当な権利者に帰属します。法令上認められる場合を除き、無断で転載、複製、改変、再配布できません。" },
        { title: "9. 成果物の権利", body: "個別案件の成果物、既存素材、汎用部品、第三者素材、オープンソースソフトウェア、利用許諾、著作権譲渡の有無等は個別契約で定めます。個別契約に定めがない権利移転を推定しません。" },
        { title: "10. 第三者サービス", body: "外部API、SaaS、クラウド、AIサービス等には提供者の規約、料金、可用性、仕様変更、停止が適用されます。当事業は選定・設定・連携に合理的な注意を払いますが、第三者サービス自体の継続や無障害を保証できません。" },
        { title: "11. AI生成物・AI利用", body: "AI出力には誤り、不完全さ、偏り、既存表現との類似等が含まれる可能性があります。用途に応じて人が確認し、重要な判断や法律・医療等の専門判断をAIだけで代替しません。AI利用範囲はAI Policyおよび個別契約に従います。" },
      ] },
      { eyebrow: "05 / INFORMATION", title: "秘密情報と個人情報", items: [
        { title: "12. 秘密保持", body: "双方は、相談・契約に伴い秘密である旨が示された情報、または性質上合理的に秘密と分かる情報を、個別合意と法令に従って取り扱います。NDAがある場合はNDAを優先します。" },
        { title: "13. 個人情報", body: "個人情報はPrivacy Policy、個別契約および法令に従って取り扱います。案件データを外部サービスへ接続する場合は、役割、送信範囲、管理主体を確認します。" },
      ] },
      { eyebrow: "06 / WARRANTY & LIABILITY", title: "保証・停止・責任", items: [
        { title: "14. 保証の範囲", body: "当事業は、合意した仕様と専門的注意に基づきサービスを提供します。ただし、AI出力、外部サービス、利用環境、法令・技術の変化等により、すべての結果、完全な正確性、特定成果、無停止・無障害を保証するものではありません。" },
        { title: "15. 免責", body: "利用者の指示・提供情報、合意範囲外の利用、第三者サービス障害、不可抗力等により生じた事象は、原因、予見可能性、双方の責任を踏まえて取り扱います。当事業の責任を一律に免除するものではなく、故意・重過失、生命・身体への損害その他法令上制限できない責任には免責・制限を適用しません。" },
        { title: "16. 契約解除", body: "重大な契約違反、支払遅延、不正利用、反社会的勢力への該当その他継続が困難な事由がある場合、相当期間を定めた是正要求その他個別契約に従い、契約の全部または一部を解除できるものとします。緊急性が高い場合はこの限りではありません。" },
        { title: "17. サービス停止・変更", body: "保守、セキュリティ対応、障害、災害、第三者サービス停止、法令対応等により、必要な範囲でサービスを停止・変更することがあります。可能な場合は事前に、緊急時は事後速やかに案内します。" },
        { title: "18. 損害賠償", body: "損害賠償の範囲、上限、手続は個別契約と適用法令に従います。責任制限を定める場合も、当事業の故意・重過失、生命・身体への損害、その他法令上制限できない責任を除外しません。" },
      ] },
      { eyebrow: "07 / GENERAL", title: "変更・準拠法・窓口", items: [
        { title: "19. 規約変更", body: "法令、事業内容、サイト機能等の変更に応じて本規約を改定します。利用者の権利・義務に重要な影響を与える変更は、効力発生日と内容を本サイト等で事前に案内します。" },
        { title: "20. 準拠法・管轄", body: "本規約および個別契約は日本法を準拠法とします。紛争は誠実に協議し、解決しない場合は、法令に別段の定めがある場合を除き、青森地方裁判所または青森簡易裁判所を第一審の合意管轄裁判所とします。" },
        { title: "21. お問い合わせ", body: `Contactページからご連絡ください。本規約の効力発生日：${LEGAL_DOCUMENT_DATES.termsEffective}` },
      ] },
    ],
  },
  tokushoho: {
    slug: "tokushoho", navLabel: "特定商取引法に基づく表記", metadataTitle: "特定商取引法に基づく表記｜L∞P Innovate", metaDescription: "未来創造工房 L∞P Innovateの販売事業者情報、料金、支払、提供時期、キャンセル等に関する表示です。",
    eyebrow: "LEGAL / COMMERCIAL TRANSACTIONS", title: "特定商取引法に基づく表記", lead: "オンラインでの申込み・販売を開始する場合に必要となる条件を、確定事実と確認待ち項目に分けて掲載します。", introduction: "推測ではなく、実際の販売条件を表示する。",
    sections: [
      { eyebrow: "01 / OPERATOR", title: "販売事業者", items: [
        { title: "販売事業者", body: TOKUSHOHO_OPERATOR_CONFIG.sellerName },
        { title: "運営責任者", body: TOKUSHOHO_OPERATOR_CONFIG.responsiblePerson },
        { title: "所在地・電話番号", body: TOKUSHOHO_OPERATOR_CONFIG.address && TOKUSHOHO_OPERATOR_CONFIG.phone ? `${TOKUSHOHO_OPERATOR_CONFIG.address} / ${TOKUSHOHO_OPERATOR_CONFIG.phone}` : DISCLOSURE_ON_REQUEST_NOTICE },
        { title: "メールアドレス", body: TOKUSHOHO_OPERATOR_CONFIG.publicEmail ?? PENDING_PUBLICATION_NOTICE },
      ] },
      { eyebrow: "02 / PRICE & PAYMENT", title: "価格と支払", items: [
        { title: "販売価格・役務の対価", body: "各サービスページ、申込画面または個別見積に表示します。個別見積では、対象範囲と含まれない作業を明示します。" },
        { title: "商品代金以外の必要料金", body: "インターネット接続・通信費、銀行振込手数料、その他利用者負担となる費用がある場合は、申込画面または個別契約で明示します。" },
        { title: "支払方法", body: TOKUSHOHO_OPERATOR_CONFIG.paymentMethods ?? PENDING_PUBLICATION_NOTICE },
        { title: "支払時期", body: "個別契約、申込画面または請求書に記載します。" },
      ] },
      { eyebrow: "03 / DELIVERY & CANCELLATION", title: "提供・キャンセル・解約", items: [
        { title: "役務提供時期", body: "契約成立後、申込画面または個別契約で合意した日程・期間に基づき提供します。" },
        { title: "キャンセル・解約", body: TOKUSHOHO_OPERATOR_CONFIG.cancellationTerms ?? PENDING_PUBLICATION_NOTICE },
        { title: "返品", body: "デジタルサービスおよび役務提供は物品販売と性質が異なるため、提供済み部分を物品として返品することはできません。不具合、契約不適合、提供前キャンセル等は、申込画面、個別契約、適用法令に従って対応します。" },
        { title: "継続契約", body: TOKUSHOHO_OPERATOR_CONFIG.recurringCancellationDeadline ?? "月額・自動更新サービスを開始する場合、契約期間、自動更新の有無、各回・総額の目安、解約方法と期限を申込前および最終確認画面に表示します。現在、オンライン継続課金は提供していません。" },
      ] },
      { eyebrow: "04 / ONLINE APPLICATION", title: "オンライン申込みの最終確認", body: "現在、本サイトに購入・決済UIはありません。将来オンライン申込みを接続する場合は、申込み確定の直前に以下を一覧で確認・訂正できる画面を設けます。", items: [
        { title: "最終確認項目", body: "サービス内容 / 数量または契約期間 / 料金・支払総額 / 支払時期 / 支払方法 / 提供時期 / 自動更新の有無 / キャンセル・解約条件" },
        { title: "Stripe等の決済条件", body: TOKUSHOHO_OPERATOR_CONFIG.stripeTerms ?? PENDING_PUBLICATION_NOTICE },
      ] },
    ],
    notice: "所在地、公開電話番号、公開メール、支払方法、キャンセル条件、継続契約の解約期限、Stripe等の決済条件は運営者確認待ちです。オンライン申込み・決済を公開する前に必ず確定してください。",
  },
  legal: {
    slug: "legal", navLabel: "Legal", metadataTitle: "Legal & Trust｜L∞P Innovate", metaDescription: "L∞P InnovateのPrivacy Policy、利用規約、特定商取引法に基づく表記、Security、AI Policyへの案内です。",
    eyebrow: "LEGAL / TRUST", title: "Legal & Trust", lead: "情報の扱い、サイト利用、取引条件、セキュリティ、AI利用について、それぞれの役割を分けて公開します。", introduction: "信頼を、説明できる状態にする。",
    sections: [
      { eyebrow: "01 / DOCUMENTS", title: "法務・信頼性に関する文書", items: [
        { title: "Privacy Policy", body: "事業活動と本サイトで取得する個人情報、外部サービス・AI利用、安全管理、本人の権利を定めます。", href: "/privacy-policy" },
        { title: "Terms of Use", body: "サイト利用、相談・契約前の条件、個別契約との関係、AI・第三者サービス、責任範囲を定めます。", href: "/terms" },
        { title: "特定商取引法に基づく表記", body: "オンライン申込み・販売時の事業者情報、価格、支払、提供、キャンセル等の条件を掲載します。", href: "/tokushoho" },
        { title: "Security", body: "権限、認証、データ最小化、外部サービス、バックアップ、不正アクセス対策等の基本方針を説明します。", href: "/security" },
        { title: "AI Policy", body: "Human oversight、データ最小化、評価、外部AIサービス、機密情報の扱いを定めます。", href: "/ai-policy" },
      ] },
      { eyebrow: "02 / OPERATOR", title: "運営者情報", items: [
        { title: "屋号", body: TOKUSHOHO_OPERATOR_CONFIG.sellerName },
        { title: "代表", body: TOKUSHOHO_OPERATOR_CONFIG.responsiblePerson },
        { title: "事業形態・拠点", body: "個人事業 / 青森県" },
        { title: "主な事業", body: "AI/DX支援、業務改善、AI-FDE、業務自動化、AIワークフロー、業務アプリ・Web開発、導入・定着支援" },
      ] },
    ],
  },
} as const satisfies Record<SiteRouteSlug, SiteRouteContent>;

export function isSiteRouteSlug(value: string): value is SiteRouteSlug {
  return SITE_ROUTE_SLUGS.includes(value as SiteRouteSlug);
}

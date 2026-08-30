import Image from "next/image";
import Link from "next/link";
import { isTokushohoPublicationReady } from "@/lib/site/legal-content";
import {
  FOUNDER_PROFILE,
  type SiteRouteContent,
  type SiteRouteSlug,
} from "@/lib/site/site-content";
import { AiFdeProcessDiagram } from "./AiFdeProcessDiagram";
import { CorporateMotion } from "./CorporateMotion";
import { CursorReactiveLight } from "./CursorReactiveLight";
import {
  AboutFieldStructureVisual,
  CaseStudyWorkflowVisual,
  ServicesSystemVisual,
} from "./RouteVisuals";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import styles from "./site.module.css";

type RoutePageProps = {
  content: SiteRouteContent;
};

const ROUTE_MOTION_MAP: Record<SiteRouteSlug, readonly string[]> = {
  about: ["scale-number", "line", "progress", "quiet"],
  services: ["stack", "stack", "stack", "warm"],
  "ai-fde": ["align", "progress", "line"],
  "case-studies": ["story", "story", "line"],
  pricing: ["slide", "line", "progress"],
  faq: ["quiet", "quiet", "quiet"],
  contact: ["reveal", "reveal", "progress"],
  security: ["quiet", "quiet", "quiet", "quiet"],
  "ai-policy": ["quiet", "quiet", "quiet", "quiet"],
  "privacy-policy": ["quiet", "quiet", "quiet", "quiet", "quiet", "quiet"],
  terms: ["quiet", "quiet", "quiet", "quiet", "quiet", "quiet", "quiet"],
  tokushoho: ["quiet", "quiet", "quiet", "quiet"],
  legal: ["quiet", "quiet"],
};

const TRUST_LEGAL_ROUTES = new Set<SiteRouteSlug>([
  "security",
  "ai-policy",
  "privacy-policy",
  "terms",
  "tokushoho",
  "legal",
]);

const ROUTE_HERO_CONTEXT: Record<
  SiteRouteSlug,
  { label: string; note: string }
> = {
  about: { label: "PROFILE / FIELD EXPERIENCE", note: "FACT-BASED PROFILE" },
  services: { label: "SCOPE / IMPLEMENTATION", note: "DISCOVERY → ADOPTION" },
  "ai-fde": { label: "L∞P-SPECIFIC MODEL", note: "FIELD LOOP IN PRACTICE" },
  "case-studies": { label: "VERIFIED WORK / 01", note: "DISCLOSURE-CONTROLLED" },
  pricing: { label: "STARTING RANGE / EX TAX", note: "SCOPE-BASED ESTIMATE" },
  faq: { label: "DECISION SUPPORT", note: "SCOPE / COST / DELIVERY" },
  contact: { label: "START FROM THE PROBLEM", note: "CONTACT LAUNCH GATE" },
  security: { label: "TRUST / SECURITY", note: "MINIMUM NECESSARY DATA" },
  "ai-policy": { label: "TRUST / AI POLICY", note: "HUMAN OVERSIGHT" },
  "privacy-policy": { label: "TRUST / PRIVACY", note: "PURPOSE / CONTROL" },
  terms: { label: "LEGAL / TERMS", note: "SCOPE / RESPONSIBILITY" },
  tokushoho: { label: "LEGAL / COMMERCE", note: "CONFIRMED FACTS ONLY" },
  legal: { label: "LEGAL / TRUST INDEX", note: "POLICY DIRECTORY" },
};

export function RoutePage({ content }: RoutePageProps) {
  const currentPath = `/${content.slug}`;
  const isTrustLegalRoute = TRUST_LEGAL_ROUTES.has(content.slug);
  const tokushohoReady = isTokushohoPublicationReady();

  return (
    <div
      className={styles.siteShell}
      data-corporate-motion-root
      data-route={content.slug}
      data-cursor-tone="dark"
    >
      <CorporateMotion />
      <CursorReactiveLight />
      <a className={styles.skipLink} href="#main-content">
        本文へ移動
      </a>
      <SiteHeader currentPath={currentPath} />
      <main
        id="main-content"
        className={styles.routeMain}
        data-cursor-tone="light"
      >
        <header
          className={styles.routeHero}
          data-motion="kinetic"
          data-cursor-tone="dark"
        >
          <div className={styles.routeHeroInner}>
            <div>
              <p className={styles.eyebrow}>{content.eyebrow}</p>
              {content.slug === "ai-fde" ? (
                <p className={styles.routeRoleLabel}>
                  L∞P-SPECIFIC / 現場密着型のAI実装支援モデル
                </p>
              ) : null}
              <h1>{content.title}</h1>
              <p className={styles.routeDescription}>{content.lead}</p>
            </div>
            {content.slug === "contact" ? (
              <div className={styles.contactIntent} aria-hidden="true">
                <span>WHAT TO BUILD</span>
                <strong>WHAT IS THE PROBLEM</strong>
              </div>
            ) : (
              <aside className={styles.routeStatus} aria-label="ページ区分">
                <span>{ROUTE_HERO_CONTEXT[content.slug].label}</span>
                <strong>{content.navLabel}</strong>
                <p>{ROUTE_HERO_CONTEXT[content.slug].note}</p>
              </aside>
            )}
          </div>
        </header>

        <section className={styles.routeIntroduction} aria-label="ページ概要" data-motion="scale" data-cursor-light-surface>
          <div className={styles.routeBodyFrame}>
            <p>{content.introduction}</p>
          </div>
        </section>

        {content.slug === "about" ? <AboutFieldStructureVisual /> : null}
        {content.slug === "services" ? <ServicesSystemVisual /> : null}
        {content.slug === "case-studies" ? <CaseStudyWorkflowVisual /> : null}

        {content.slug === "ai-fde" ? (
          <section
            className={styles.aiFdeProcessSection}
            aria-labelledby="ai-fde-process-heading"
            data-motion="reveal"
            data-cursor-light-surface
          >
            <div className={styles.routeBodyFrame}>
              <div className={styles.aiFdeProcessHeader}>
                <div>
                  <p className={styles.eyebrow}>DELIVERY MODEL / AI-FDE</p>
                  <h2 id="ai-fde-process-heading">思想を、実務の支援へ。</h2>
                </div>
                <p>FIELD LOOPの思想を、現場理解、設計、実装、定着、検証というプロジェクトの支援工程へ落とし込みます。</p>
              </div>
              <AiFdeProcessDiagram />
            </div>
          </section>
        ) : null}

        <div className={styles.routeSections}>
          {content.sections.map((section, index) => {
            const motion = ROUTE_MOTION_MAP[content.slug][index] ?? "reveal";
            const itemMotion = motion === "progress" ? "progress-item" : motion === "line" ? "line-item" : "stagger";
            const visibleItems = section.items.filter(
              (item) => item.href !== "/tokushoho" || tokushohoReady,
            );

            const isAiFdeDefinition = content.slug === "ai-fde" && index === 0;
            const isAboutFounder = content.slug === "about" && index === 0;

            return (
                <section
                  key={section.eyebrow}
                  className={`${styles.routeSection} ${isAiFdeDefinition ? styles.aiFdeDefinitionSection : ""} ${isAboutFounder ? styles.aboutFounderSection : ""} ${isTrustLegalRoute ? styles.legalDocumentSection : ""}`}
                  aria-labelledby={`${content.slug}-section-${index}`}
                  data-motion={motion}
                  data-cursor-light-surface
                >
                  {isAiFdeDefinition ? (
                    <div className={styles.aiFdeDefinitionBackground} aria-hidden="true">
                      <Image
                        src="/media/corporate/ai-fde-definition-wide.webp"
                        alt=""
                        fill
                        sizes="100vw"
                      />
                    </div>
                  ) : null}
                  <div className={styles.routeBodyFrame}>
                    <p className={styles.eyebrow}>{section.eyebrow}</p>
                    {content.slug === "about" && index === 0 ? (
                      <span className={styles.routeMetric} aria-hidden="true">20+</span>
                    ) : null}
                    {content.slug === "ai-fde" && index === 0 ? (
                      <div className={styles.routeBridge} aria-hidden="true">
                        <span>現場</span><i /><strong>AI-FDE</strong><i /><span>開発</span>
                      </div>
                    ) : null}
                    <div className={styles.routeSectionContent}>
                      {isAboutFounder ? (
                        <figure className={styles.founderPortraitFigure}>
                          <div className={styles.founderPortraitMedia}>
                            <Image
                              className={styles.founderPortraitImage}
                              src={FOUNDER_PROFILE.portrait}
                              alt={FOUNDER_PROFILE.portraitAlt}
                              fill
                              sizes="(max-width: 64rem) 20rem, 32vw"
                            />
                          </div>
                          <figcaption className={styles.founderPortraitCaption}>
                            <span>FOUNDER / PROFILE</span>
                            <strong>{FOUNDER_PROFILE.name}</strong>
                          </figcaption>
                        </figure>
                      ) : null}
                      <div className={isAboutFounder ? styles.founderProfileCopy : undefined}>
                        <h2 id={`${content.slug}-section-${index}`}>{section.title}</h2>
                        {section.lead ? (
                          <p className={styles.routeSectionLead}>{section.lead}</p>
                        ) : null}
                        {section.body ? <p>{section.body}</p> : null}
                        {section.note ? (
                          <p className={styles.routeSectionNote}>{section.note}</p>
                        ) : null}
                      </div>
                      {visibleItems.length > 0 ? (
                        content.slug === "faq" ? (
                          <div className={styles.routeFaqList}>
                            {visibleItems.map((item) => (
                              <details key={item.title} data-motion="quiet">
                                <summary>{item.title}</summary>
                                {item.body ? <p>{item.body}</p> : null}
                              </details>
                              ))}
                          </div>
                        ) : (
                          <ul>
                            {visibleItems.map((item) => (
                              <li key={item.title} data-motion={itemMotion}>
                                {isTrustLegalRoute ? (
                                  <h3>
                                    {item.href ? (
                                      <Link className={styles.legalDocumentLink} href={item.href}>
                                        {item.title} <span aria-hidden="true">↗</span>
                                      </Link>
                                    ) : item.title}
                                  </h3>
                                ) : (
                                  <strong>{item.title}</strong>
                                )}
                                {item.price ? (
                                  <span className={styles.routeItemPrice}>
                                    {item.price}
                                    <small>税別</small>
                                  </span>
                                ) : null}
                                {item.body ? <p>{item.body}</p> : null}
                              </li>
                            ))}
                          </ul>
                        )
                      ) : null}
                    </div>
                  </div>
                </section>
            );
          })}
        </div>

        {content.notice ? (
          <aside className={styles.contentNotice} data-cursor-light-surface>
            <div className={styles.routeBodyFrame}>
              <span>NOTE</span>
              <p>{content.notice}</p>
            </div>
          </aside>
        ) : null}

        <nav
          className={styles.routeNext}
          aria-label={content.slug === "contact" ? "本番公開時のお問い合わせ方針" : "次のページ"}
          data-motion="open"
          data-cursor-tone="dark"
        >
          <div className={styles.routeBodyFrame}>
            {content.slug === "contact" ? (
              <>
                <p>CONTACT / WORDPRESS LAUNCH GATE</p>
                <div>
                  <h2 aria-label="送信できる状態を、公開条件に。">
                    <span>送信できる状態を、</span>
                    <span>公開条件に。</span>
                  </h2>
                  <div className={styles.contactLaunchGate}>
                    <p>
                      WordPress本番公開時に、安定したフォーム、SMTP、通知・自動返信、スパム対策、同意確認、成功・エラー表示まで接続します。
                    </p>
                    <Link href="/privacy-policy">
                      個人情報の取扱いを確認 <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p>CONTACT / START FROM THE FIELD</p>
                <div>
                  <h2 aria-label="まずは、課題から。">
                    <span>まずは、</span>
                    <span>課題から。</span>
                  </h2>
                  <Link href="/contact">
                    お問い合わせ <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

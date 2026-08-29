import Image from "next/image";
import Link from "next/link";
import type { SiteRouteContent, SiteRouteSlug } from "@/lib/site/site-content";
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

export function RoutePage({ content }: RoutePageProps) {
  const currentPath = `/${content.slug}`;
  const isTrustLegalRoute = TRUST_LEGAL_ROUTES.has(content.slug);

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
              <h1>{content.title}</h1>
              <p className={styles.routeDescription}>{content.lead}</p>
            </div>
            {content.slug === "contact" ? (
              <div className={styles.contactIntent} aria-hidden="true">
                <span>WHAT TO BUILD</span>
                <strong>WHAT IS THE PROBLEM</strong>
              </div>
            ) : null}
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
                  <p className={styles.eyebrow}>AI-FDE / SIX-STAGE PROCESS</p>
                  <h2 id="ai-fde-process-heading">現場を知ることから、次の改善まで。</h2>
                </div>
                <p>理解、整理、設計、実装、定着、検証を、一度きりで終わらせず次の現場理解へつなぎます。</p>
              </div>
              <AiFdeProcessDiagram />
            </div>
          </section>
        ) : null}

        <div className={styles.routeSections}>
          {content.sections.map((section, index) => {
            const motion = ROUTE_MOTION_MAP[content.slug][index] ?? "reveal";
            const itemMotion = motion === "progress" ? "progress-item" : motion === "line" ? "line-item" : "stagger";

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
                              src="/media/corporate/founder-koichi-mikami.webp"
                              alt="L∞P Innovate代表 三上耕一のプロフィール写真"
                              fill
                              sizes="(max-width: 64rem) 20rem, 32vw"
                            />
                          </div>
                          <figcaption className={styles.founderPortraitCaption}>
                            <span>FOUNDER / PROFILE</span>
                            <strong>三上 耕一</strong>
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
                      {section.items.length > 0 ? (
                        content.slug === "faq" ? (
                          <div className={styles.routeFaqList}>
                            {section.items.map((item) => (
                              <details key={item.title} data-motion="quiet">
                                <summary>{item.title}</summary>
                                {item.body ? <p>{item.body}</p> : null}
                              </details>
                            ))}
                          </div>
                        ) : (
                          <ul>
                            {section.items.map((item) => (
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
          aria-label="次のページ"
          data-motion="open"
          data-cursor-tone="dark"
        >
          <div className={styles.routeBodyFrame}>
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
          </div>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

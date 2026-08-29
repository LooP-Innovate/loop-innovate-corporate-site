import Image from "next/image";
import { FieldToInfinityMotion } from "./FieldToInfinityMotion";
import styles from "./site.module.css";

const ABOUT_FACTS = [
  { label: "FIELD EXPERIENCE", value: "20+ years" },
  { label: "QUALIFICATION", value: "Social Worker" },
  { label: "QUALIFICATION", value: "Certified Care Worker" },
  { label: "PRACTICE", value: "ICT / Productivity" },
  { label: "IMPLEMENTATION", value: "AI / Workflow" },
  {
    label: "DELIVERY PATH",
    value: "Field → Requirement → Implementation",
  },
] as const;

const SERVICE_STAGES = [
  {
    index: "01",
    name: "ORDER",
    meaning: "課題と業務を整理する",
    src: "/media/journey/still/02-order.webp",
    alt: "散在する情報を整理するORDER段階のコンセプトビジュアル",
  },
  {
    index: "02",
    name: "DESIGN",
    meaning: "改善の仕組みを設計する",
    src: "/media/journey/still/03-design.webp",
    alt: "改善の構造を組み立てるDESIGN段階のコンセプトビジュアル",
  },
  {
    index: "03",
    name: "BUILD",
    meaning: "AI・自動化を実装する",
    src: "/media/journey/still/04-build.webp",
    alt: "設計を動く仕組みに変えるBUILD段階のコンセプトビジュアル",
  },
  {
    index: "04",
    name: "ADOPT",
    meaning: "現場に導入し定着させる",
    src: "/media/journey/still/05-adopt.webp",
    alt: "仕組みを現場の運用へつなぐADOPT段階のコンセプトビジュアル",
  },
] as const;

const CASE_WORKFLOW = [
  { index: "01", title: "相談記録", note: "記録を入力する" },
  { index: "02", title: "管理者確認", note: "内容を確認する" },
  { index: "03", title: "閲覧確認", note: "職員の確認状況を扱う" },
  { index: "04", title: "月次集計", note: "月単位で集計する" },
  { index: "05", title: "CSV / 印刷", note: "必要な形式で出力する" },
] as const;

export function AboutFieldStructureVisual() {
  return (
    <section
      className={styles.routeVisualSection}
      aria-labelledby="about-field-structure-title"
      data-motion="reveal"
      data-cursor-light-surface
    >
      <div className={styles.routeVisualFrame}>
        <div className={styles.aboutVisualGrid}>
          <figure className={styles.aboutVisualMedia} data-cursor-tone="dark">
            <Image
              className={styles.aboutVisualImage}
              src="/media/journey/still/01-field.webp"
              width={1672}
              height={941}
              sizes="(max-width: 767px) 100vw, 64vw"
              loading="eager"
              alt="現場に立ち、状況を観察することを象徴したFIELDのコンセプトビジュアル"
            />
            <span className={styles.aboutVisualShade} aria-hidden="true" />
            <FieldToInfinityMotion />
            <figcaption className={styles.aboutVisualCaption}>
              CONCEPTUAL FIELD VIEW — 現場理解の構造を表すブランドビジュアル。人物の肖像ではありません。
            </figcaption>
          </figure>

          <div className={styles.aboutVisualFacts}>
            <p className={styles.routeVisualEyebrow}>INFINITY INTELLIGENCE / FIELD STRUCTURE</p>
            <h2 id="about-field-structure-title" className={styles.routeVisualTitle}>
              <span>点として見える</span>
              <span>出来事を、</span>
              <span>実装できる構造へ。</span>
            </h2>
            <p className={styles.routeVisualLead}>
              現場で得た事実をつなぎ、要件として整理し、運用できる仕組みへ変換します。
            </p>
            <dl className={styles.aboutFactList}>
              {ABOUT_FACTS.map((fact) => (
                <div className={styles.aboutFactItem} key={`${fact.label}-${fact.value}`}>
                  <dt className={styles.aboutFactLabel}>{fact.label}</dt>
                  <dd className={styles.aboutFactValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSystemVisual() {
  return (
    <section
      className={styles.routeVisualSection}
      aria-labelledby="services-system-visual-title"
      data-motion="reveal"
      data-cursor-light-surface
    >
      <div className={styles.routeVisualFrame}>
        <figure className={styles.servicesVisualFigure}>
          <header className={styles.servicesVisualHeader}>
            <div>
              <p className={styles.routeVisualEyebrow}>SERVICE SYSTEM / FROM ISSUE TO OPERATION</p>
              <h2 id="services-system-visual-title" className={styles.routeVisualTitle}>
                <span>整理して、設計して、</span>
                <span>動かし、現場へ渡す。</span>
              </h2>
            </div>
            <p className={styles.routeVisualLead}>
              単体のツールではなく、課題整理から運用定着までを一つの支援の流れとして扱います。
            </p>
          </header>

          <ol className={styles.servicesFlow}>
            {SERVICE_STAGES.map((stage) => (
              <li className={styles.servicesStage} key={stage.name}>
                <div className={styles.servicesStageMedia}>
                  <Image
                    className={styles.servicesStageImage}
                    src={stage.src}
                    width={1672}
                    height={941}
                    sizes="(max-width: 767px) 88vw, (max-width: 1100px) 42vw, 21vw"
                    alt={stage.alt}
                  />
                  <span className={styles.servicesStageIndex} aria-hidden="true">
                    {stage.index}
                  </span>
                </div>
                <div className={styles.servicesStageCopy}>
                  <strong>{stage.name}</strong>
                  <span>{stage.meaning}</span>
                </div>
              </li>
            ))}
          </ol>
          <figcaption className={styles.aboutVisualCaption}>
            CONCEPTUAL SERVICE FLOW — 支援範囲の関係を示す編集図であり、実在する操作画面ではありません。
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function CaseStudyWorkflowVisual() {
  return (
    <section
      className={styles.routeVisualSection}
      aria-labelledby="case-study-workflow-title"
      data-motion="reveal"
      data-cursor-light-surface
    >
      <div className={styles.routeVisualFrame}>
        <figure className={styles.caseVisualFigure}>
          <header className={styles.caseVisualHeader}>
            <div>
              <p className={styles.routeVisualEyebrow}>CASE 01 / VERIFIED WORKFLOW</p>
              <h2 id="case-study-workflow-title" className={styles.routeVisualTitle}>
                <span>記録だけで終わらない、</span>
                <span>確認と集計までの業務構造。</span>
              </h2>
            </div>
            <p className={styles.routeVisualLead}>
              公開可能な範囲で、相談記録管理業務に実装した流れを抽象化しています。
            </p>
          </header>

          <div className={styles.caseBoundary}>
            <ol className={styles.caseWorkflow} aria-label="相談記録管理の業務フロー">
              {CASE_WORKFLOW.map((step) => (
                <li className={styles.caseWorkflowStep} key={step.index}>
                  <span className={styles.caseWorkflowMarker} aria-hidden="true" />
                  <div className={styles.caseWorkflowCopy}>
                    <span className={styles.caseWorkflowIndex}>{step.index}</span>
                    <strong className={styles.caseWorkflowTitle}>{step.title}</strong>
                    <span>{step.note}</span>
                  </div>
                </li>
              ))}
            </ol>

            <aside className={styles.caseBoundaryFooter} aria-label="セキュリティと運用の設計境界">
              <p className={styles.caseBoundaryLabel}>SECURITY / OPERATION BOUNDARY</p>
              <ul className={styles.caseBoundaryItems}>
                <li>利用者</li>
                <li>権限</li>
                <li>保存先</li>
                <li>出力</li>
              </ul>
            </aside>
          </div>

          <figcaption className={styles.caseVisualNote}>
            本図は実画面の再現ではありません。実装済みの業務フローを、機密情報を含まない形で図式化しています。
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

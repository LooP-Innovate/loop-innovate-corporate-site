import Image from "next/image";
import Link from "next/link";
import {
  HOME_FAQ,
  HOME_PROCESS,
  HOME_SERVICES,
} from "@/lib/site/site-content";
import { CorporateAutoRail } from "./CorporateAutoRail";
import { FieldToSystemTypewriter } from "./FieldToSystemTypewriter";
import { PrincipleGraphic } from "./PrincipleGraphic";
import { SectionIntro } from "./SectionIntro";
import styles from "./site.module.css";

export function HomeSections() {
  return (
    <div
      className={styles.corporateSurface}
      data-corporate-surface
      data-cursor-tone="light"
    >
      <section className={styles.journeyExit} aria-labelledby="journey-exit-title" data-motion="open" data-cursor-light-surface>
        <div className={styles.fieldLoopWideBackground} aria-hidden="true">
          <Image
            src="/media/corporate/field-loop-fields-wide.webp"
            alt=""
            fill
            sizes="100vw"
          />
        </div>
        <div className={styles.exitField} aria-hidden="true" />
        <div className={styles.exitContent}>
          <p className={styles.eyebrow}>RETURN / JOURNEY EXIT</p>
          <h2 id="journey-exit-title">FIELD LOOP</h2>
          <p>現場へ戻り、結果を確かめ、次の改善へつなげる。</p>
        </div>
      </section>

      <CorporateAutoRail />

      <section className={styles.positioning} aria-labelledby="positioning-title" data-cursor-light-surface>
        <div className={styles.sectionFrame}>
          <SectionIntro
            eyebrow="POSITIONING / FIELD TO SYSTEM"
            title="現場理解から、使われる仕組みへ。"
            titleParts={["現場理解から、", "使われる仕組みへ。"]}
            motion="split"
            body="現場を理解することから、実装後の運用まで。技術を目的にせず、業務として機能するところまで設計します。"
            titleId="positioning-title"
          />
          <div className={styles.positioningGrid}>
            <article data-motion="stagger">
              <span>01</span>
              <PrincipleGraphic kind="human" />
              <h3>Human-centered</h3>
              <p className={styles.principleSubtitle}>人から逆算する</p>
              <p>使う人から逆算する。ツールを選ぶ前に、人と業務が実際にどう動いているかを理解します。</p>
            </article>
            <article data-motion="stagger">
              <span>02</span>
              <PrincipleGraphic kind="judgment" />
              <h3>Intelligent</h3>
              <p className={styles.principleSubtitle}>判断を仕組みに変える</p>
              <p>技術を、判断と仕組みに変える。何をAIに任せ、何を人が判断するのかを業務の流れとして設計します。</p>
            </article>
            <article data-motion="stagger">
              <span>03</span>
              <PrincipleGraphic kind="operation" />
              <h3>Real-world</h3>
              <p className={styles.principleSubtitle}>現場で育て続ける</p>
              <p>使われ続けるところまで考える。小さく試し、運用し、見直しながら定着へつなげます。</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.editorialSection} aria-labelledby="what-we-do-title" data-cursor-light-surface>
        <div className={styles.sectionFrame}>
          <SectionIntro
            eyebrow="WHAT WE DO / FIELD TO SYSTEM"
            title="技術と現場のあいだを、設計する。"
            body="現場の言葉を要件に翻訳し、要件を実装へ落とし込み、実装を運用へつなぐ。L∞P Innovateは、コンサルティングと開発を分断せず、一つの改善プロセスとして扱います。"
            titleId="what-we-do-title"
          />
          <div className={styles.statementGrid}>
            <div className={styles.statementAxis} aria-hidden="true" data-motion="align">
              <span>FIELD</span>
              <i />
              <span>TECHNOLOGY</span>
            </div>
            <FieldToSystemTypewriter />
            <div className={styles.statementBody}>
              <p>
                業務ヒアリング、課題整理、設計、試作、実装、導入、操作説明、運用改善まで。必要な範囲を見極め、現場に合う規模から進めます。
              </p>
              <Link className={styles.textLink} href="/about">
                私たちの考え方を見る <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection} aria-labelledby="services-title" data-cursor-light-surface>
        <div className={styles.sectionFrame}>
          <SectionIntro
            eyebrow="SERVICES / WHAT WE PROVIDE"
            title="支援領域"
            body="AIや自動化を「導入すること」ではなく、現場の課題を整理し、使える仕組みに変えるための支援です。"
            titleId="services-title"
          />
          <div className={styles.serviceList} data-motion="stack">
            {HOME_SERVICES.map((service) => (
              <article key={service.number} className={styles.serviceRow} data-motion="stack-card">
                <span>{service.number}</span>
                <div>
                  <p>{service.english}</p>
                  <h3>{service.title}</h3>
                </div>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
          <Link className={styles.outlineLink} href="/services">
            サービスを詳しく見る
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section
        className={styles.approachSection}
        aria-labelledby="approach-title"
        data-cursor-tone="dark"
      >
        <div className={styles.sectionFrame}>
          <SectionIntro
            eyebrow="AI / DX APPROACH"
            title="導入ではなく、機能する状態へ。"
            body="生成AIや自動化は、導入しただけでは改善になりません。目的、データ、業務フロー、人の判断、運用条件まで整理して、初めて「使える仕組み」になります。"
            titleId="approach-title"
          />
          <div className={styles.approachGrid} data-motion="progress">
            <div className={styles.approachIndex} aria-hidden="true">
              <span>F</span>
              <span>O</span>
              <span>D</span>
              <span>B</span>
              <span>A</span>
              <span>R</span>
            </div>
            <ol className={styles.approachList}>
              <li data-motion="stagger">
                <span>01</span>
                <div><h3>目的から逆算する</h3><p>最初に決めるのはツールではありません。何を改善したいのか、何が変われば前進なのかを整理します。</p></div>
              </li>
              <li data-motion="stagger">
                <span>02</span>
                <div><h3>データと運用条件を確認する</h3><p>利用する情報、権限、セキュリティ、担当者、既存業務との関係を確認し、現実的な運用方法を設計します。</p></div>
              </li>
              <li data-motion="stagger">
                <span>03</span>
                <div><h3>検証から定着へ接続する</h3><p>必要な範囲から小さく試し、実際に使えることを確認してから広げます。マニュアルや運用ルールも含め、利用・評価・改善へつなげます。</p></div>
              </li>
            </ol>
          </div>
          <Link className={styles.textLinkOnDark} href="/ai-fde">
            AI-FDEを見る <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className={styles.editorialSection} aria-labelledby="work-title" data-cursor-light-surface>
        <div className={styles.sectionFrame}>
          <SectionIntro
            eyebrow="SELECTED WORK / VERIFIED DELIVERY"
            title="実装したものを、事実で示す。"
            body="公開可能な範囲で、担当した内容・成果物・運用設計が確認できる事例のみを掲載します。"
            titleId="work-title"
          />
          <article className={styles.workPlaceholder} data-motion="mask">
            <div>
              <span>CASE 01 / WELFARE OPERATIONS</span>
              <p>BUSINESS APPLICATION / VERIFIED DELIVERY</p>
            </div>
            <div>
              <h3>相談記録管理業務を、運用できるWebアプリへ</h3>
              <p>相談記録、管理者確認、閲覧チェック、月次集計、CSV出力、印刷、来場者数管理までを一つの業務フローとして整理。要件整理からアプリ構築、移行手順、操作マニュアル、オンライン説明まで対応しました。</p>
              <Link className={styles.textLink} href="/case-studies">
                事例を見る <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.processSection} aria-labelledby="process-title" data-cursor-light-surface>
        <div className={styles.sectionFrame}>
          <SectionIntro
            eyebrow="PROCESS / FIELD LOOP"
            title="FIELDから、RETURNまで。"
            body="改善を一度きりの導入ではなく、現場へ戻りながら更新し続ける循環として捉えています。"
            titleId="process-title"
          />
          <ol className={styles.processList} data-motion="flow">
            {HOME_PROCESS.map((step, index) => (
              <li key={step.id} data-motion="flow-step">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step.id}</strong>
                <p><b>{step.label}</b><small>{step.description}</small></p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.pricingSection} aria-labelledby="pricing-title" data-cursor-light-surface>
        <div className={styles.sectionFrame}>
          <SectionIntro
            eyebrow="PRICING / SCOPE FIRST"
            title="必要なものから、適切な規模で。"
            body="案件ごとに、対象業務・実装範囲・連携・セキュリティ・導入支援の内容が異なります。課題整理、小規模検証、個別実装、継続支援から必要な形を組み合わせます。"
            titleId="pricing-title"
          />
          <div className={styles.pricingPanel} data-motion="scale">
            <div>
              <span>PRICING MODEL</span>
              <strong>SCOPE FIRST</strong>
            </div>
            <ul>
              <li data-motion="slide">Initial Definition / 課題整理</li>
              <li data-motion="slide">PoC / 小規模検証</li>
              <li data-motion="slide">Project Build / 個別実装</li>
              <li data-motion="slide">Continuous Support / 継続支援</li>
            </ul>
            <Link className={styles.solidLink} href="/pricing">
              料金の考え方を見る <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.faqSection} aria-labelledby="faq-title" data-cursor-light-surface>
        <div className={styles.sectionFrame}>
          <SectionIntro
            eyebrow="FAQ / START FROM THE PROBLEM"
            title="まずは、困っている業務から。"
            body="相談前の準備、対応範囲、AIやITに詳しくない場合の進め方をまとめています。"
            titleId="faq-title"
          />
          <div className={styles.faqList}>
            {HOME_FAQ.map((item, index) => (
              <details key={item.question}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.question}
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <Link className={styles.textLink} href="/faq">
            よくある質問を見る <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section
        className={styles.contactCta}
        aria-labelledby="contact-title"
        data-motion="open"
        data-cursor-tone="dark"
      >
        <div className={styles.contactGrid}>
          <p className={styles.eyebrow}>CONTACT / START FROM THE FIELD</p>
          <div>
            <h2 id="contact-title" aria-label="「何をつくるか」より、「何を変えるか」から。">
              <span className={styles.ctaHeadingDesktop} aria-hidden="true">
                <span>「何をつくるか」より、</span>
                <span>「何を変えるか」から。</span>
              </span>
              <span className={styles.ctaHeadingMobile} aria-hidden="true">
                <span>「何をつくるか」</span>
                <span>より、</span>
                <span>「何を変えるか」</span>
                <span>から。</span>
              </span>
            </h2>
            <p aria-label="つくるものが決まっていなくても構いません。今の業務と、変えたいことを整理するところから始めます。">
              <span className={styles.ctaSupportDesktop} aria-hidden="true">
                <span>つくるものが決まっていなくても構いません。</span>
                <span>今の業務と、変えたいことを整理するところから始めます。</span>
              </span>
              <span className={styles.ctaSupportMobile} aria-hidden="true">
                <span>つくるものが決まっていなくても</span>
                <span>構いません。</span>
                <span>今の業務と、変えたいことを</span>
                <span>整理するところから始めます。</span>
              </span>
            </p>
          </div>
          <Link className={styles.contactLink} href="/contact">
            お問い合わせ <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { LoopJourney } from "@/components/scrollytelling/LoopJourney";
import { CorporateMotion } from "@/components/site/CorporateMotion";
import { CursorReactiveLight } from "@/components/site/CursorReactiveLight";
import { HomeSections } from "@/components/site/HomeSections";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import siteStyles from "@/components/site/site.module.css";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div
      className={siteStyles.siteShell}
      data-corporate-motion-root
      data-cursor-tone="dark"
    >
      <CorporateMotion />
      <CursorReactiveLight />
      <a className={siteStyles.skipLink} href="#main-content">
        本文へ移動
      </a>
      <SiteHeader currentPath="/" />
      <main id="main-content" className={styles.page}>
        <div className={styles.heroJourney} data-cursor-tone="dark">
          <div className={styles.heroCopy}>
            <p>FIELD LOOP / HUMAN-CENTERED AI IMPLEMENTATION</p>
            <h1>
              <span>現場を、</span>
              <span>仕組みから変える。</span>
            </h1>
            <div className={styles.heroActions}>
              <Link href="/services">支援内容を見る</Link>
              <Link href="/contact">相談する</Link>
            </div>
            <div className={styles.heroMeta}>
              <span>SCROLL TO EXPLORE</span>
              <span>FIELD / ORDER / DESIGN / BUILD / ADOPT / RETURN</span>
            </div>
          </div>
          <LoopJourney />
        </div>
        <HomeSections />
      </main>
      <SiteFooter />
    </div>
  );
}

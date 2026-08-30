import Link from "next/link";
import { isTokushohoPublicationReady } from "@/lib/site/legal-content";
import {
  FOOTER_NAVIGATION,
  POLICY_NAVIGATION,
} from "@/lib/site/site-content";
import styles from "./site.module.css";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const copyrightYears = currentYear > 2025 ? `2025–${currentYear}` : "2025";
  const policyNavigation = POLICY_NAVIGATION.filter(
    (item) => item.href !== "/tokushoho" || isTokushohoPublicationReady(),
  );

  return (
    <footer className={styles.siteFooter} data-cursor-tone="dark">
      <div className={styles.footerLead}>
        <div>
          <Link className={styles.footerWordmark} href="/">
            L∞P Innovate
          </Link>
          <p>FIELD LOOP</p>
        </div>
      </div>

      <div className={styles.footerNavigation}>
        <nav aria-label="フッターナビゲーション">
          <p>Explore</p>
          {FOOTER_NAVIGATION.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="ポリシーナビゲーション">
          <p>Trust &amp; Legal</p>
          {policyNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.footerStatus}>
          <p>Availability</p>
          <span>AOMORI / ONLINE</span>
          <small>AI / DX / WORKFLOW<br />現場の課題整理からご相談いただけます。</small>
          <Link href="/contact">Contact ↗</Link>
        </div>
      </div>

      <div className={styles.footerMeta}>
        <p>© {copyrightYears} L∞P Innovate. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

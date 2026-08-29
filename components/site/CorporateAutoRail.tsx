import styles from "./site.module.css";

const CORPORATE_TERMS = [
  "AI CONSULTING",
  "WORKFLOW",
  "AUTOMATION",
  "SYSTEM DESIGN",
  "WEB",
  "DX",
  "OPERATIONS",
  "WELFARE",
  "EDUCATION",
] as const;

function RailTerms({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className={styles.corporateRailGroup} aria-hidden={hidden || undefined}>
      {CORPORATE_TERMS.map((term) => (
        <li key={term}>
          <span aria-hidden="true">∞</span>
          {term}
        </li>
      ))}
    </ul>
  );
}

export function CorporateAutoRail() {
  return (
    <section className={styles.corporateRail} aria-label="L∞P capability fields">
      <div className={styles.corporateRailMeta}>
        <span>FIELDS / CONTINUOUS PRACTICE</span>
        <button className={styles.corporateRailPause} type="button">
          FOCUS / TOUCH TO HOLD
        </button>
      </div>
      <div className={styles.corporateRailViewport}>
        <div className={styles.corporateRailTrack}>
          <RailTerms />
          <RailTerms hidden />
        </div>
      </div>
    </section>
  );
}

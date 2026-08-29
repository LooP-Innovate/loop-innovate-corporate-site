import styles from "./site.module.css";

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  body?: string;
  titleId: string;
  align?: "start" | "split";
  motion?: "kinetic" | "split" | "quiet";
  titleParts?: readonly string[];
};

export function SectionIntro({
  eyebrow,
  title,
  body,
  titleId,
  align = "split",
  motion = "kinetic",
  titleParts,
}: SectionIntroProps) {
  return (
    <header
      className={`${styles.sectionIntro} ${
        align === "start" ? styles.sectionIntroStart : ""
      }`}
      data-motion={motion}
    >
      <p className={styles.eyebrow}>{eyebrow}</p>
      <div>
        <h2 id={titleId}>
          {titleParts
            ? titleParts.map((part) => <span key={part}>{part}</span>)
            : title}
        </h2>
        {body ? <p>{body}</p> : null}
      </div>
    </header>
  );
}

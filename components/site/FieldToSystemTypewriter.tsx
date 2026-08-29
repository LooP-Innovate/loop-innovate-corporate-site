import type { CSSProperties } from "react";
import styles from "./site.module.css";

type TypewriterCell = {
  character: string;
  delay: number;
  cursorDuration: number;
  isFinal?: boolean;
};

const TYPEWRITER_LINES = [
  {
    word: "FIELD",
    delays: [180, 340, 500, 660, 820],
    nextDelay: 1250,
  },
  {
    word: "TO",
    delays: [1250, 1420],
    nextDelay: 1820,
  },
  {
    word: "SYSTEM",
    delays: [1820, 1960, 2100, 2240, 2380, 2520],
    nextDelay: 3920,
  },
] as const;

function getCells(
  word: string,
  delays: readonly number[],
  nextDelay: number,
): TypewriterCell[] {
  return Array.from(word).map((character, index) => ({
    character,
    delay: delays[index],
    cursorDuration: (delays[index + 1] ?? nextDelay) - delays[index],
    isFinal: word === "SYSTEM" && index === word.length - 1,
  }));
}

function getCellStyle(cell: TypewriterCell) {
  return {
    "--typewriter-delay": `${cell.delay}ms`,
    "--typewriter-cursor-duration": `${cell.cursorDuration}ms`,
  } as CSSProperties;
}

export function FieldToSystemTypewriter() {
  return (
    <p className={styles.largeStatement} data-motion="typewriter">
      <span className={styles.visuallyHidden}>FIELD TO SYSTEM</span>
      <span className={styles.typewriterVisual} aria-hidden="true">
        {TYPEWRITER_LINES.map(({ word, delays, nextDelay }) => (
          <span className={styles.typewriterLine} key={word}>
            {getCells(word, delays, nextDelay).map((cell, index) => (
              <span
                className={styles.typewriterCell}
                key={`${word}-${index}`}
                style={getCellStyle(cell)}
              >
                <span className={styles.typewriterGlyph}>{cell.character}</span>
                <i
                  className={`${styles.typewriterCursor} ${
                    cell.isFinal ? styles.typewriterCursorFinal : ""
                  }`}
                />
              </span>
            ))}
          </span>
        ))}
      </span>
    </p>
  );
}

import Image from "next/image";
import { RETURN_EXIT_ASSETS } from "@/lib/scrollytelling/return-assets";
import styles from "./loop-journey.module.css";

export function DotDitherTransition() {
  return (
    <div className={styles.dotDither} aria-hidden="true">
      <Image
        className={styles.dotDitherAsset}
        src={RETURN_EXIT_ASSETS.particles}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        draggable={false}
        unoptimized
      />
      <span className={styles.dotDitherField} />
      <Image
        className={styles.dotDitherWash}
        src={RETURN_EXIT_ASSETS.wash}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        draggable={false}
        unoptimized
      />
      <span className={styles.dotDitherRelease} />
    </div>
  );
}

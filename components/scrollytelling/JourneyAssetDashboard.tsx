import Image from "next/image";
import { SCENES } from "@/lib/scrollytelling/scene-config";
import {
  resolveJourneyFocalPoint,
  resolveJourneyStill,
} from "@/lib/scrollytelling/still-resolver";
import styles from "./journey-asset-dashboard.module.css";

export function JourneyAssetDashboard() {
  return (
    <div className={styles.grid}>
      {SCENES.map((scene) => {
        const desktopStill = resolveJourneyStill(scene, {
          variant: "desktop",
        });
        const mobileStill = resolveJourneyStill(scene, { variant: "mobile" });

        return (
          <article className={styles.asset} key={scene.id}>
            <header>
              <span>{String(scene.index + 1).padStart(2, "0")}</span>
              <h2>{scene.label}</h2>
              <strong data-status={desktopStill.status}>
                {desktopStill.kind === "placeholder"
                  ? "MISSING"
                  : `${desktopStill.kind.toUpperCase()} READY`}
              </strong>
            </header>

            {desktopStill.src ? (
              <div className={styles.preview}>
                <Image
                  className={styles.previewImage}
                  src={desktopStill.src}
                  alt=""
                  fill
                  sizes="(max-width: 48rem) 100vw, 33vw"
                />
              </div>
            ) : (
              <div className={styles.previewFallback}>{scene.label}</div>
            )}

            <dl>
              <div>
                <dt>Role</dt>
                <dd>{scene.mediaRole}</dd>
              </div>
              <div>
                <dt>Overlay</dt>
                <dd>{scene.overlayMode}</dd>
              </div>
              <div>
                <dt>Desktop still</dt>
                <dd>{desktopStill.src ?? "—"}</dd>
              </div>
              <div>
                <dt>Mobile still</dt>
                <dd>
                  {mobileStill.src
                    ? `${mobileStill.src} (${mobileStill.sourceVariant})`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt>Contract file</dt>
                <dd>{scene.contractStillFile}</dd>
              </div>
              <div>
                <dt>Desktop focal</dt>
                <dd>{resolveJourneyFocalPoint(scene, "desktop")}</dd>
              </div>
              <div>
                <dt>Tablet focal</dt>
                <dd>{resolveJourneyFocalPoint(scene, "tablet")}</dd>
              </div>
              <div>
                <dt>Mobile focal</dt>
                <dd>{resolveJourneyFocalPoint(scene, "mobile")}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}

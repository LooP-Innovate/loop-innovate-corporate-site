import styles from "./scroll-video.module.css";

export type ScrollVideoMetrics = {
  scrollProgress: number;
  targetTime: number;
  currentTime: number;
  duration: number;
  viewportHeight: number;
  reducedMotion: boolean;
  readyState: number;
};

type ScrollVideoDebugProps = {
  enabled?: boolean;
  metrics: ScrollVideoMetrics;
};

export function ScrollVideoDebug({
  enabled = process.env.NODE_ENV !== "production",
  metrics,
}: ScrollVideoDebugProps) {
  if (!enabled) {
    return null;
  }

  return (
    <aside className={styles.debugPanel} aria-label="Scroll video diagnostics">
      <p className={styles.debugTitle}>L∞P SCROLL VIDEO LAB</p>
      <dl className={styles.debugList}>
        <div>
          <dt>Scroll Progress</dt>
          <dd>{(metrics.scrollProgress * 100).toFixed(1)}%</dd>
        </div>
        <div>
          <dt>Target Time</dt>
          <dd>{metrics.targetTime.toFixed(2)}s</dd>
        </div>
        <div>
          <dt>Current Time</dt>
          <dd>{metrics.currentTime.toFixed(2)}s</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{metrics.duration.toFixed(2)}s</dd>
        </div>
        <div>
          <dt>Viewport Height</dt>
          <dd>{metrics.viewportHeight}px</dd>
        </div>
        <div>
          <dt>Reduced Motion</dt>
          <dd>{String(metrics.reducedMotion)}</dd>
        </div>
        <div>
          <dt>Video Ready State</dt>
          <dd>{metrics.readyState}</dd>
        </div>
      </dl>
    </aside>
  );
}

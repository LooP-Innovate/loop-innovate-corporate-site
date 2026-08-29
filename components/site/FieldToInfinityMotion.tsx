"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./site.module.css";

const PARTICLE_COUNT = 48;
const TAU = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const SIMPLIFIED_QUERY =
  "(max-width: 48rem), (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)";

const PHASES = [
  { limit: 0.16, label: "01 / CLUSTER" },
  { limit: 0.34, label: "02 / RELEASE" },
  { limit: 0.52, label: "03 / SPLIT" },
  { limit: 0.7, label: "04 / ALIGNMENT" },
  { limit: 0.9, label: "05 / RECONSTRUCTION" },
  { limit: 1, label: "06 / SETTLE" },
] as const;

type Point = {
  x: number;
  y: number;
};

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const interpolate = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

const smoothstep = (start: number, end: number, value: number) => {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
};

const mixPoint = (start: Point, end: Point, progress: number): Point => ({
  x: interpolate(start.x, end.x, progress),
  y: interpolate(start.y, end.y, progress),
});

const noise = (seed: number) => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const infinityPoint = (
  theta: number,
  width: number,
  height: number,
): Point => ({
  x: width * 0.5 + Math.sin(theta) * width * 0.31,
  y: height * 0.45 + Math.sin(theta * 2) * height * 0.145,
});

const particleStages = (
  index: number,
  width: number,
  height: number,
) => {
  const angle = index * GOLDEN_ANGLE;
  const theta = (index / PARTICLE_COUNT) * TAU;
  const minimumSide = Math.min(width, height);
  const radialNoise = 0.86 + noise(index + 3) * 0.2;
  const radius =
    Math.sqrt((index + 0.65) / PARTICLE_COUNT) *
    minimumSide *
    0.2 *
    radialNoise;
  const center = { x: width * 0.5, y: height * 0.45 };
  const cluster = {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius,
  };
  const release = {
    x:
      center.x +
      (cluster.x - center.x) * 1.42 +
      Math.cos(angle * 1.7) * minimumSide * 0.018,
    y:
      center.y +
      (cluster.y - center.y) * 1.42 +
      Math.sin(angle * 1.35) * minimumSide * 0.018,
  };
  const side = Math.sin(theta) >= 0 ? 1 : -1;
  const localAngle = theta * 2.1 + noise(index + 17) * 0.7;
  const localRadius = 0.35 + noise(index + 29) * 0.65;
  const split = {
    x:
      center.x +
      side * width * 0.18 +
      Math.cos(localAngle) * width * 0.066 * localRadius,
    y:
      center.y +
      Math.sin(localAngle) * height * 0.14 * localRadius,
  };
  const final = infinityPoint(theta, width, height);
  const alignment = {
    x: interpolate(split.x, final.x, 0.62),
    y:
      interpolate(split.y, final.y, 0.48) +
      ((index % 3) - 1) * Math.min(5, height * 0.012),
  };
  const reconstruction = {
    x: interpolate(alignment.x, final.x, 0.84),
    y: interpolate(alignment.y, final.y, 0.84),
  };

  return { cluster, release, split, alignment, reconstruction, final };
};

const particlePoint = (
  index: number,
  width: number,
  height: number,
  progress: number,
) => {
  const stages = particleStages(index, width, height);

  if (progress < 0.16) {
    return mixPoint(
      stages.cluster,
      stages.release,
      smoothstep(0, 0.16, progress),
    );
  }

  if (progress < 0.34) {
    return mixPoint(
      stages.release,
      stages.split,
      smoothstep(0.16, 0.34, progress),
    );
  }

  if (progress < 0.52) {
    return mixPoint(
      stages.split,
      stages.alignment,
      smoothstep(0.34, 0.52, progress),
    );
  }

  if (progress < 0.7) {
    return mixPoint(
      stages.alignment,
      stages.reconstruction,
      smoothstep(0.52, 0.7, progress),
    );
  }

  return mixPoint(
    stages.reconstruction,
    stages.final,
    smoothstep(0.7, 0.9, progress),
  );
};

const traceInfinity = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  completion: number,
) => {
  const sampleCount = Math.max(2, Math.ceil(180 * completion));

  context.beginPath();
  for (let index = 0; index <= sampleCount; index += 1) {
    const theta = (index / 180) * TAU;
    const point = infinityPoint(theta, width, height);

    if (index === 0) {
      context.moveTo(point.x, point.y);
    } else {
      context.lineTo(point.x, point.y);
    }
  }
};

const drawNarrative = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
) => {
  context.clearRect(0, 0, width, height);
  context.lineCap = "round";
  context.lineJoin = "round";

  const points = Array.from({ length: PARTICLE_COUNT }, (_, index) =>
    particlePoint(index, width, height, progress),
  );
  const relationshipAlpha = (1 - smoothstep(0.34, 0.68, progress)) * 0.22;

  context.lineWidth = 0.75;
  context.strokeStyle = `rgba(127, 204, 232, ${relationshipAlpha})`;
  for (let index = 0; index < 12; index += 1) {
    const first = points[(index * 4) % PARTICLE_COUNT];
    const second = points[(index * 7 + 11) % PARTICLE_COUNT];
    context.beginPath();
    context.moveTo(first.x, first.y);
    context.lineTo(second.x, second.y);
    context.stroke();
  }

  const alignmentAlpha =
    smoothstep(0.34, 0.58, progress) *
    (1 - smoothstep(0.78, 0.96, progress));
  context.strokeStyle = `rgba(247, 251, 255, ${alignmentAlpha * 0.16})`;
  context.lineWidth = 0.7;
  [-0.11, 0, 0.11].forEach((offset) => {
    context.beginPath();
    context.moveTo(width * 0.18, height * (0.45 + offset));
    context.lineTo(width * 0.82, height * (0.45 + offset));
    context.stroke();
  });

  const guideAlpha = smoothstep(0.5, 0.72, progress) * 0.16;
  traceInfinity(context, width, height, 1);
  context.strokeStyle = `rgba(127, 204, 232, ${guideAlpha})`;
  context.lineWidth = 0.9;
  context.stroke();

  const reconstruction = smoothstep(0.62, 0.91, progress);
  if (reconstruction > 0) {
    traceInfinity(context, width, height, reconstruction);
    context.strokeStyle = `rgba(127, 204, 232, ${0.16 + reconstruction * 0.18})`;
    context.lineWidth = 3;
    context.shadowColor = "rgba(50, 139, 211, 0.16)";
    context.shadowBlur = 5;
    context.stroke();

    traceInfinity(context, width, height, reconstruction);
    context.strokeStyle = `rgba(247, 251, 255, ${0.44 + reconstruction * 0.38})`;
    context.lineWidth = 0.9;
    context.shadowBlur = 0;
    context.stroke();
  }

  points.forEach((point, index) => {
    const emphasis = index % 9 === 0;
    const radius = emphasis ? 2 : 1.05 + noise(index + 41) * 0.55;
    const particleAlpha =
      0.48 + noise(index + 53) * 0.28 + smoothstep(0.7, 1, progress) * 0.12;

    context.beginPath();
    context.arc(point.x, point.y, radius, 0, TAU);
    context.fillStyle = emphasis
      ? `rgba(247, 251, 255, ${Math.min(0.92, particleAlpha + 0.12)})`
      : `rgba(127, 204, 232, ${particleAlpha})`;
    context.shadowColor = emphasis ? "rgba(127, 204, 232, 0.34)" : "transparent";
    context.shadowBlur = emphasis ? 4 : 0;
    context.fill();
  });

  context.shadowBlur = 0;
};

export function FieldToInfinityMotion() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const phaseLabel = phaseRef.current;
    const context = canvas?.getContext("2d");

    if (!wrapper || !canvas || !context) {
      return;
    }

    const simplifiedQuery = window.matchMedia(SIMPLIFIED_QUERY);
    let frameId = 0;
    let isNearViewport = true;
    let motionEnabled = false;

    const calculateProgress = () => {
      const bounds = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const travel = viewportHeight * 0.62 + bounds.height * 0.36;

      return clamp((viewportHeight * 0.88 - bounds.top) / travel);
    };

    const render = () => {
      frameId = 0;
      const bounds = wrapper.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = Math.round(width * pixelRatio);
      const targetHeight = Math.round(height * pixelRatio);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const progress = motionEnabled ? calculateProgress() : 1;
      const phaseIndex = PHASES.findIndex((phase) => progress <= phase.limit);
      const phase = PHASES[Math.max(0, phaseIndex)];

      wrapper.dataset.phase = String(Math.max(1, phaseIndex + 1));
      wrapper.style.setProperty("--field-infinity-progress", String(progress));
      if (phaseLabel) {
        phaseLabel.textContent = phase.label;
      }

      drawNarrative(context, width, height, progress);
    };

    const scheduleRender = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handleScroll = () => {
      if (motionEnabled && isNearViewport) {
        scheduleRender();
      }
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting;
        if (isNearViewport) {
          scheduleRender();
        }
      },
      { rootMargin: "28% 0px" },
    );

    const syncMotionMode = () => {
      const nextMotionEnabled = !simplifiedQuery.matches;
      if (nextMotionEnabled === motionEnabled) {
        scheduleRender();
        return;
      }

      motionEnabled = nextMotionEnabled;
      if (motionEnabled) {
        visibilityObserver.observe(wrapper);
        window.addEventListener("scroll", handleScroll, { passive: true });
      } else {
        visibilityObserver.unobserve(wrapper);
        window.removeEventListener("scroll", handleScroll);
        isNearViewport = true;
      }
      scheduleRender();
    };

    const resizeObserver = new ResizeObserver(scheduleRender);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleRender();
      } else if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    resizeObserver.observe(wrapper);
    simplifiedQuery.addEventListener("change", syncMotionMode);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    syncMotionMode();

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      simplifiedQuery.removeEventListener("change", syncMotionMode);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      id="field-to-infinity"
      ref={wrapperRef}
      className={`${styles.aboutStructureGraphic} ${styles.fieldInfinityMotion}`}
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-field-to-infinity
      data-phase="1"
    >
      <span id={titleId} className={styles.visuallyHidden}>
        現場の情報が改善循環へ再構成される図
      </span>
      <span id={descriptionId} className={styles.visuallyHidden}>
        散在する現場情報が、整理、分岐、整列、再構成を経て、水平の二つの閉ループからなる循環へ変わります。
      </span>
      <canvas
        ref={canvasRef}
        className={styles.fieldInfinityCanvas}
        aria-hidden="true"
      />
      <div className={styles.fieldInfinityHeader} aria-hidden="true">
        <span>FIELD → INFINITY</span>
        <span ref={phaseRef}>01 / CLUSTER</span>
      </div>
      <div className={styles.fieldInfinityLegend} aria-hidden="true">
        <span>FIELD SIGNAL</span>
        <span>SYSTEM LOGIC</span>
        <span>FIELD LOOP</span>
      </div>
    </div>
  );
}

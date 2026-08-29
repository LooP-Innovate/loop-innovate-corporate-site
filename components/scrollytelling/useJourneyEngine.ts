"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SCENE_COUNT,
  SCENES,
  getSceneByIndex,
  type JourneyFocalTier,
} from "@/lib/scrollytelling/scene-config";
import {
  getJourneyInteractionState,
  type BuildWindowStep,
  type ReturnExitPhase,
  type ReturnPhase,
} from "@/lib/scrollytelling/interaction-timeline";
import {
  calculateJourneyTimeline,
  getSceneJourneyProgress,
  type JourneyTimeline,
} from "@/lib/scrollytelling/timeline";

const DEBUG_UPDATE_INTERVAL_MS = 100;
const DIRECTION_SWITCH_THRESHOLD = 0.002;
// Keep ADOPT readable before the endpoint RETURN story takes over the final
// transition. Visual formation still follows the existing interaction timeline.
const RETURN_STORY_START = 0.55;

export const JOURNEY_DEBUG_ENABLED =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_JOURNEY_DEBUG === "true";

type JourneyGeometry = {
  sectionTop: number;
  scrollDistance: number;
};

type MotionPreference = {
  known: boolean;
  reduced: boolean;
};

export type JourneyScrollDirection = "forward" | "reverse";

export type JourneyRuntimeMetrics = {
  journeyProgress: number;
  sceneIndex: number;
  sceneId: string;
  nextSceneId: string;
  segmentProgress: number;
  blendProgress: number;
  scrollDirection: JourneyScrollDirection;
  reducedMotion: boolean;
  journeyInView: boolean;
  viewportTier: JourneyFocalTier;
  renderMode: "still";
  transitionState: "hold" | "blend" | "endpoint";
  buildWindowStep: BuildWindowStep;
  returnPhase: ReturnPhase;
  returnProgress: number;
  returnExitPhase: ReturnExitPhase;
  returnExitProgress: number;
};

const initialTimeline = calculateJourneyTimeline(0, SCENE_COUNT);

const initialMetrics: JourneyRuntimeMetrics = {
  journeyProgress: 0,
  sceneIndex: 0,
  sceneId: SCENES[0].id,
  nextSceneId: SCENES[1]?.id ?? SCENES[0].id,
  segmentProgress: 0,
  blendProgress: 0,
  scrollDirection: "forward",
  reducedMotion: false,
  journeyInView: false,
  viewportTier: "desktop",
  renderMode: "still",
  transitionState: "hold",
  buildWindowStep: "observe",
  returnPhase: "base",
  returnProgress: 0,
  returnExitPhase: "hold",
  returnExitProgress: 0,
};

function getViewportTier(): JourneyFocalTier {
  if (window.matchMedia("(max-width: 48rem)").matches) {
    return "mobile";
  }

  if (window.matchMedia("(max-width: 64rem)").matches) {
    return "tablet";
  }

  return "desktop";
}

function getTransitionState(
  timeline: JourneyTimeline,
): JourneyRuntimeMetrics["transitionState"] {
  if (timeline.nextSceneIndex === timeline.sceneIndex) {
    return "endpoint";
  }

  return timeline.blendProgress > 0 ? "blend" : "hold";
}

function setVisualVariables(
  section: HTMLElement,
  timeline: JourneyTimeline,
  reducedMotion: boolean,
): void {
  const currentScene = getSceneByIndex(timeline.sceneIndex);
  const interaction = getJourneyInteractionState(
    timeline,
    currentScene.id,
    reducedMotion,
  );
  const sceneProgress = reducedMotion ? 0.5 : timeline.segmentProgress;
  const destinationProgress = reducedMotion ? 0.5 : timeline.blendProgress;
  const blendProgress = reducedMotion ? 0 : timeline.blendProgress;

  const writeDerivedProgress = (prefix: string, progress: number) => {
    const centeredProgress = progress - 0.5;

    section.style.setProperty(`${prefix}-x`, `${centeredProgress * -3.5}rem`);
    section.style.setProperty(
      `${prefix}-x-reverse`,
      `${centeredProgress * 3.5}rem`,
    );
    section.style.setProperty(`${prefix}-y`, `${centeredProgress * -1.5}rem`);
    section.style.setProperty(`${prefix}-angle`, `${centeredProgress * 2}deg`);
    section.style.setProperty(
      `${prefix}-scale`,
      String(0.99 + progress * 0.02),
    );
  };

  section.style.setProperty(
    "--loop-journey-progress",
    String(timeline.journeyProgress),
  );
  section.style.setProperty("--loop-scene-progress", String(sceneProgress));
  section.style.setProperty(
    "--loop-destination-progress",
    String(destinationProgress),
  );
  section.style.setProperty("--loop-journey-blend", String(blendProgress));
  section.style.setProperty(
    "--loop-return-progress",
    String(interaction.returnProgress),
  );
  section.style.setProperty(
    "--loop-return-base-opacity",
    String(interaction.returnBaseOpacity),
  );
  section.style.setProperty(
    "--loop-return-star-breath",
    String(interaction.returnStarBreath),
  );
  section.style.setProperty(
    "--loop-return-horizon-glow",
    String(interaction.returnHorizonGlow),
  );
  section.style.setProperty(
    "--loop-return-sky-lift",
    String(interaction.returnSkyLift),
  );
  section.style.setProperty(
    "--loop-return-grid-flow",
    String(interaction.returnGridFlow),
  );
  section.style.setProperty(
    "--loop-return-blue-particles",
    String(interaction.returnBlueParticles),
  );
  section.style.setProperty(
    "--loop-return-exit-progress",
    String(interaction.returnExitProgress),
  );
  section.style.setProperty(
    "--loop-return-exit-particles",
    String(interaction.returnExitParticles),
  );
  section.style.setProperty(
    "--loop-return-exit-erosion",
    String(interaction.returnExitErosion),
  );
  section.style.setProperty(
    "--loop-return-exit-wash",
    String(interaction.returnExitWash),
  );
  section.style.setProperty(
    "--loop-return-exit-white",
    String(interaction.returnExitWhite),
  );
  section.style.setProperty(
    "--loop-return-exit-edge",
    `${interaction.returnExitEdge}%`,
  );
  section.style.setProperty("--loop-adopt-light", String(interaction.adoptLight));
  section.dataset.orderPhase = interaction.orderPhase;
  section.dataset.designPhase = interaction.designPhase;
  section.dataset.buildStep = interaction.buildStep;
  section.dataset.returnPhase = interaction.returnPhase;
  section.dataset.returnExitPhase = interaction.returnExitPhase;
  section.dataset.returnExitProgress = interaction.returnExitProgress.toFixed(4);
  section.dataset.returnExitErosion = interaction.returnExitErosion.toFixed(4);
  writeDerivedProgress("--loop-scene", sceneProgress);
  writeDerivedProgress("--loop-destination", destinationProgress);
}

export function useJourneyEngine({
  debugEnabled = JOURNEY_DEBUG_ENABLED,
}: { debugEnabled?: boolean } = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const geometryRef = useRef<JourneyGeometry>({
    sectionTop: 0,
    scrollDistance: 1,
  });
  const timelineRef = useRef<JourneyTimeline>(initialTimeline);
  const scrollDirectionRef = useRef<JourneyScrollDirection>("forward");
  const directionAnchorRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const journeyInViewRef = useRef(false);
  const viewportTierRef = useRef<JourneyFocalTier>("desktop");
  const activeSceneIndexRef = useRef(0);
  const viewportOrientationRef = useRef<"portrait" | "landscape" | null>(
    null,
  );
  const debugTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDebugUpdateRef = useRef(0);

  const [timeline, setTimeline] = useState(initialTimeline);
  const [viewportTier, setViewportTier] =
    useState<JourneyFocalTier>("desktop");
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [motionPreference, setMotionPreference] = useState<MotionPreference>({
    known: false,
    reduced: false,
  });
  const [metrics, setMetrics] = useState(initialMetrics);

  const writeMetrics = useCallback(() => {
    const currentTimeline = timelineRef.current;
    const currentScene = getSceneByIndex(currentTimeline.sceneIndex);
    const nextScene = getSceneByIndex(currentTimeline.nextSceneIndex);
    const interaction = getJourneyInteractionState(
      currentTimeline,
      currentScene.id,
      reducedMotionRef.current,
    );

    lastDebugUpdateRef.current = performance.now();
    setMetrics({
      journeyProgress: currentTimeline.journeyProgress,
      sceneIndex: currentTimeline.sceneIndex,
      sceneId: currentScene.id,
      nextSceneId: nextScene.id,
      segmentProgress: currentTimeline.segmentProgress,
      blendProgress: currentTimeline.blendProgress,
      scrollDirection: scrollDirectionRef.current,
      reducedMotion: reducedMotionRef.current,
      journeyInView: journeyInViewRef.current,
      viewportTier: viewportTierRef.current,
      renderMode: "still",
      transitionState: getTransitionState(currentTimeline),
      buildWindowStep: interaction.buildStep,
      returnPhase: interaction.returnPhase,
      returnProgress: interaction.returnProgress,
      returnExitPhase: interaction.returnExitPhase,
      returnExitProgress: interaction.returnExitProgress,
    });
  }, []);

  const scheduleMetrics = useCallback(
    (force = false) => {
      if (!debugEnabled) {
        return;
      }

      const elapsed = performance.now() - lastDebugUpdateRef.current;

      if (force || elapsed >= DEBUG_UPDATE_INTERVAL_MS) {
        if (debugTimerRef.current !== null) {
          clearTimeout(debugTimerRef.current);
          debugTimerRef.current = null;
        }
        writeMetrics();
        return;
      }

      if (debugTimerRef.current === null) {
        debugTimerRef.current = setTimeout(() => {
          debugTimerRef.current = null;
          writeMetrics();
        }, DEBUG_UPDATE_INTERVAL_MS - elapsed);
      }
    },
    [debugEnabled, writeMetrics],
  );

  const updateProgress = useCallback(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const { sectionTop, scrollDistance } = geometryRef.current;
    const rawProgress = (window.scrollY - sectionTop) / scrollDistance;
    const baseTimeline = calculateJourneyTimeline(rawProgress, SCENE_COUNT);
    const blendStart = getSceneByIndex(baseTimeline.sceneIndex).blendStart;
    const nextTimeline = calculateJourneyTimeline(
      rawProgress,
      SCENE_COUNT,
      blendStart,
    );
    const previousSceneIndex = timelineRef.current.sceneIndex;
    const directionDelta =
      nextTimeline.journeyProgress - directionAnchorRef.current;

    if (Math.abs(directionDelta) >= DIRECTION_SWITCH_THRESHOLD) {
      scrollDirectionRef.current = directionDelta > 0 ? "forward" : "reverse";
      directionAnchorRef.current = nextTimeline.journeyProgress;
    }

    timelineRef.current = nextTimeline;
    setVisualVariables(section, nextTimeline, reducedMotionRef.current);
    const nextActiveSceneIndex =
      nextTimeline.nextSceneIndex === SCENE_COUNT - 1 &&
      nextTimeline.segmentProgress >= RETURN_STORY_START
        ? SCENE_COUNT - 1
        : nextTimeline.sceneIndex;

    if (nextActiveSceneIndex !== activeSceneIndexRef.current) {
      activeSceneIndexRef.current = nextActiveSceneIndex;
      setActiveSceneIndex(nextActiveSceneIndex);
    }
    section.dataset.journeyProgress = nextTimeline.journeyProgress.toFixed(4);
    section.dataset.sceneIndex = String(nextTimeline.sceneIndex);
    section.dataset.sceneId = getSceneByIndex(nextTimeline.sceneIndex).id;
    section.dataset.activeSceneId = getSceneByIndex(nextActiveSceneIndex).id;
    section.dataset.renderMode = "still";

    if (previousSceneIndex !== nextTimeline.sceneIndex) {
      setTimeline(nextTimeline);
    }

    scheduleMetrics();
  }, [scheduleMetrics]);

  const handleScroll = useCallback(() => {
    if (journeyInViewRef.current) {
      updateProgress();
    }
  }, [updateProgress]);

  const measureGeometry = useCallback(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) {
      return null;
    }

    const sectionRect = section.getBoundingClientRect();
    const stickyRect = sticky.getBoundingClientRect();
    const geometry = {
      sectionTop: sectionRect.top + window.scrollY,
      scrollDistance: Math.max(1, sectionRect.height - stickyRect.height),
    };
    geometryRef.current = geometry;

    return geometry;
  }, []);

  const measureJourney = useCallback(() => {
    if (!measureGeometry()) {
      return;
    }

    updateProgress();
  }, [measureGeometry, updateProgress]);

  const handleViewportResize = useCallback(() => {
    const nextOrientation =
      window.innerWidth >= window.innerHeight ? "landscape" : "portrait";
    const previousOrientation = viewportOrientationRef.current;
    const preserveProgress =
      previousOrientation !== null &&
      previousOrientation !== nextOrientation &&
      journeyInViewRef.current;
    const journeyProgress = timelineRef.current.journeyProgress;
    const nextViewportTier = getViewportTier();

    viewportOrientationRef.current = nextOrientation;

    if (nextViewportTier !== viewportTierRef.current) {
      viewportTierRef.current = nextViewportTier;
      setViewportTier(nextViewportTier);
    }

    const geometry = measureGeometry();
    if (!geometry) {
      return;
    }

    if (preserveProgress) {
      window.scrollTo({
        top: geometry.sectionTop + journeyProgress * geometry.scrollDistance,
        behavior: "auto",
      });
    }

    updateProgress();
    scheduleMetrics(true);
  }, [measureGeometry, scheduleMetrics, updateProgress]);

  const jumpToScene = useCallback(
    (sceneIndex: number) => {
      measureJourney();
      const targetProgress = getSceneJourneyProgress(sceneIndex, SCENE_COUNT);
      const { sectionTop, scrollDistance } = geometryRef.current;

      window.scrollTo({
        top: Math.ceil(sectionTop + targetProgress * scrollDistance),
        behavior: reducedMotionRef.current ? "auto" : "smooth",
      });
    },
    [measureJourney],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
      setMotionPreference({ known: true, reduced: mediaQuery.matches });
      updateProgress();
      scheduleMetrics(true);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, [scheduleMetrics, updateProgress]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const visibleObserver = new IntersectionObserver(
      ([entry]) => {
        journeyInViewRef.current = entry.isIntersecting;

        if (entry.isIntersecting) {
          measureJourney();
        }

        scheduleMetrics(true);
      },
      { threshold: 0 },
    );

    visibleObserver.observe(section);

    return () => visibleObserver.disconnect();
  }, [measureJourney, scheduleMetrics]);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) {
      return;
    }

    const resizeObserver = new ResizeObserver(handleViewportResize);
    resizeObserver.observe(section);
    resizeObserver.observe(sticky);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleViewportResize);
    window.addEventListener("orientationchange", handleViewportResize);
    window.visualViewport?.addEventListener("resize", handleViewportResize);
    handleViewportResize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleViewportResize);
      window.removeEventListener("orientationchange", handleViewportResize);
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportResize,
      );
    };
  }, [handleScroll, handleViewportResize]);

  useEffect(
    () => () => {
      if (debugTimerRef.current !== null) {
        clearTimeout(debugTimerRef.current);
      }
    },
    [],
  );

  return {
    sectionRef,
    stickyRef,
    timeline,
    viewportTier,
    activeSceneIndex,
    motionPreference,
    metrics,
    jumpToScene,
  };
}

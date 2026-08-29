"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { calculateScrollProgress } from "@/lib/motion/scrollProgress";
import {
  ScrollVideoDebug,
  type ScrollVideoMetrics,
} from "./ScrollVideoDebug";
import styles from "./scroll-video.module.css";

const VIDEO_SOURCE = "/video/field-v01.mp4";
const VIDEO_POSTER_SOURCE: string | undefined = undefined;
const SMOOTHING_FACTOR = 0.15;
const SEEK_THRESHOLD_SECONDS = 1 / 90;
const DEBUG_UPDATE_INTERVAL_MS = 80;

function getFiniteVideoDuration(video: HTMLVideoElement): number | null {
  return Number.isFinite(video.duration) && video.duration > 0
    ? video.duration
    : null;
}

const initialMetrics: ScrollVideoMetrics = {
  scrollProgress: 0,
  targetTime: 0,
  currentTime: 0,
  duration: 0,
  viewportHeight: 0,
  reducedMotion: false,
  readyState: 0,
};

export function ScrollVideoLab() {
  const labRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(0);
  const durationRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [motionPreference, setMotionPreference] = useState({
    known: false,
    reduced: false,
  });
  const [videoMissing, setVideoMissing] = useState(false);

  const syncVideoMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const duration = getFiniteVideoDuration(video);
    if (duration === null) {
      return;
    }

    durationRef.current = duration;
    setVideoMissing(false);
    setMetrics((previous) => ({
      ...previous,
      duration,
      targetTime: reducedMotionRef.current
        ? 0
        : duration * progressRef.current,
      currentTime: video.currentTime,
      readyState: video.readyState,
    }));

    if (reducedMotionRef.current) {
      video.currentTime = 0;
    }
  }, []);

  const updateScrollMeasurement = useCallback(() => {
    const lab = labRef.current;
    if (!lab) {
      return;
    }

    const viewportHeight = window.innerHeight;
    const progress = calculateScrollProgress(
      window.scrollY,
      lab.offsetTop,
      lab.offsetHeight,
      viewportHeight,
    );

    progressRef.current = progress;
    setMetrics((previous) => ({
      ...previous,
      scrollProgress: progress,
      targetTime: reducedMotionRef.current
        ? 0
        : durationRef.current * progress,
      viewportHeight,
    }));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
      setMotionPreference({ known: true, reduced: mediaQuery.matches });
      setMetrics((previous) => ({
        ...previous,
        reducedMotion: mediaQuery.matches,
      }));
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    updateScrollMeasurement();
    window.addEventListener("scroll", updateScrollMeasurement, { passive: true });
    window.addEventListener("resize", updateScrollMeasurement);

    return () => {
      window.removeEventListener("scroll", updateScrollMeasurement);
      window.removeEventListener("resize", updateScrollMeasurement);
    };
  }, [updateScrollMeasurement]);

  useEffect(() => {
    const video = videoRef.current;
    if (
      video &&
      video.readyState >= HTMLMediaElement.HAVE_METADATA &&
      getFiniteVideoDuration(video) !== null
    ) {
      syncVideoMetadata();
    }
  }, [syncVideoMetadata]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motionPreference.known) {
      return;
    }

    if (motionPreference.reduced) {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = 0;
      }
      setMetrics((previous) => ({
        ...previous,
        targetTime: 0,
        currentTime: 0,
        readyState: video.readyState,
      }));
      return;
    }

    let animationFrameId = 0;
    let smoothedTime = video.currentTime;
    let lastDebugUpdate = 0;

    const animate = (timestamp: number) => {
      const duration = durationRef.current;
      const targetTime = duration * progressRef.current;

      if (duration > 0 && Number.isFinite(duration)) {
        smoothedTime += (targetTime - smoothedTime) * SMOOTHING_FACTOR;

        if (Math.abs(targetTime - smoothedTime) < SEEK_THRESHOLD_SECONDS) {
          smoothedTime = targetTime;
        }

        if (Math.abs(video.currentTime - smoothedTime) >= SEEK_THRESHOLD_SECONDS) {
          try {
            video.currentTime = smoothedTime;
          } catch {
            // The browser may temporarily reject seeking before media is seekable.
          }
        }
      }

      if (timestamp - lastDebugUpdate >= DEBUG_UPDATE_INTERVAL_MS) {
        setMetrics((previous) => ({
          ...previous,
          targetTime,
          currentTime: video.currentTime,
          duration,
          readyState: video.readyState,
        }));
        lastDebugUpdate = timestamp;
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [motionPreference]);

  const handleVideoError = () => {
    durationRef.current = 0;
    setVideoMissing(true);
    setMetrics((previous) => ({
      ...previous,
      targetTime: 0,
      currentTime: 0,
      duration: 0,
      readyState: videoRef.current?.readyState ?? 0,
    }));
  };

  return (
    <main>
      <section ref={labRef} className={styles.lab} aria-labelledby="lab-title">
        <h1 id="lab-title" className={styles.visuallyHidden}>
          Scroll Video Lab
        </h1>

        <div className={styles.viewport}>
          <video
            ref={videoRef}
            className={`${styles.video} ${videoMissing ? styles.videoHidden : ""}`}
            src={VIDEO_SOURCE}
            poster={VIDEO_POSTER_SOURCE}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={syncVideoMetadata}
            onDurationChange={syncVideoMetadata}
            onLoadedData={syncVideoMetadata}
            onCanPlay={syncVideoMetadata}
            onError={handleVideoError}
          />

          {videoMissing && (
            <div className={styles.placeholder} role="status">
              <p>FIELD VIDEO NOT LOADED</p>
              <span>Place:</span>
              <code>public/video/field-v01.mp4</code>
            </div>
          )}

          <ScrollVideoDebug metrics={metrics} />
        </div>
      </section>
    </main>
  );
}

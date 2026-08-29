"use client";

import { useEffect } from "react";

const MOTION_SELECTOR = "[data-motion]";
const TYPEWRITER_COMPLETE_DELAY = 4100;

export function CorporateMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      "[data-corporate-motion-root]",
    );

    if (!root) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(MOTION_SELECTOR),
    );
    const typewriterTargets = targets.filter(
      (target) => target.dataset.motion === "typewriter",
    );

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      root.dataset.motionReady = "reduced";
      targets.forEach((target) => {
        target.dataset.motionVisible = "true";
      });
      typewriterTargets.forEach((target) => {
        target.dataset.typewriterState = "complete";
      });
      return;
    }

    root.dataset.motionReady = "true";
    typewriterTargets.forEach((target) => {
      target.dataset.typewriterState = "ready";
    });
    const completionTimers = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (!entry.isIntersecting) {
            return;
          }

          target.dataset.motionVisible = "true";
          if (target.dataset.motion === "typewriter") {
            target.dataset.typewriterState = "typing";
            const timerId = window.setTimeout(() => {
              target.dataset.typewriterState = "complete";
              completionTimers.delete(timerId);
            }, TYPEWRITER_COMPLETE_DELAY);
            completionTimers.add(timerId);
          }
          observer.unobserve(target);
        });
      },
      {
        rootMargin: "-8% 0px -10%",
        threshold: [0, 0.12, 0.4],
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      completionTimers.forEach((timerId) => window.clearTimeout(timerId));
      completionTimers.clear();
      delete root.dataset.motionReady;
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useRef } from "react";
import styles from "./site.module.css";

const ENABLE_QUERY =
  "(min-width: 64.001rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)";
const SURFACE_SELECTOR = "[data-cursor-light-surface]";
const TONE_SELECTOR =
  "[data-cursor-tone], [data-surface], [data-cursor-light-surface]";
const INTERACTIVE_SELECTOR =
  "a, button, summary, [role='button'], [role='link'], [data-cursor-orb-target]";
const NATIVE_CURSOR_SELECTOR =
  "input, textarea, select, [contenteditable='true'], [contenteditable='plaintext-only'], [role='textbox'], iframe, [data-native-cursor]";
const SELECTABLE_TEXT_SELECTOR =
  "p, h1, h2, h3, h4, h5, h6, li, dt, dd, blockquote, code, pre, [data-cursor-text]";

type Point = {
  x: number;
  y: number;
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const resolveSurfaceTone = (source: HTMLElement | null) => {
  const explicitTone = source?.dataset.cursorTone;
  const dynamicTone = source?.dataset.surface;

  if (explicitTone === "light" || explicitTone === "dark") {
    return explicitTone;
  }

  if (dynamicTone === "light" || dynamicTone === "dark") {
    return dynamicTone;
  }

  return source?.hasAttribute("data-cursor-light-surface")
    ? "light"
    : "dark";
};

export function CursorReactiveLight() {
  const orbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      "[data-corporate-motion-root]",
    );
    const orb = orbRef.current;

    if (!root || !orb) {
      return;
    }

    const capability = window.matchMedia(ENABLE_QUERY);
    let activeSurface: HTMLElement | null = null;
    let frameId = 0;
    let enabled = false;
    let hasPosition = false;
    const current: Point = { x: 0, y: 0 };
    const target: Point = { x: 0, y: 0 };

    const cancelFrame = () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const hideSurfaceLight = () => {
      activeSurface?.style.setProperty("--cursor-light-opacity", "0");
      activeSurface = null;
    };

    const hideOrb = () => {
      orb.dataset.visible = "false";
      orb.dataset.interactive = "false";
      orb.dataset.pressed = "false";
      orb.dataset.suppressed = "false";
      orb.dataset.surfaceTone = "dark";
      hasPosition = false;
    };

    const renderFrame = () => {
      frameId = 0;

      if (!hasPosition) {
        return;
      }

      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;
      orb.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;

      if (activeSurface) {
        const bounds = activeSurface.getBoundingClientRect();
        activeSurface.style.setProperty(
          "--cursor-light-x",
          `${current.x - bounds.left}px`,
        );
        activeSurface.style.setProperty(
          "--cursor-light-y",
          `${current.y - bounds.top}px`,
        );
      }

      if (
        Math.abs(target.x - current.x) > 0.35 ||
        Math.abs(target.y - current.y) > 0.35
      ) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const scheduleFrame = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        cancelFrame();
        hideSurfaceLight();
        hideOrb();
        return;
      }

      const eventTarget = event.target;
      if (!(eventTarget instanceof Element)) {
        hideSurfaceLight();
        hideOrb();
        return;
      }

      const nativeCursorTarget = eventTarget.closest(NATIVE_CURSOR_SELECTOR);
      const interactiveTarget = eventTarget.closest<HTMLElement>(
        INTERACTIVE_SELECTOR,
      );
      const surface = eventTarget.closest<HTMLElement>(SURFACE_SELECTOR);
      const toneSource = eventTarget.closest<HTMLElement>(TONE_SELECTOR);
      const selectableTextTarget = interactiveTarget
        ? null
        : eventTarget.closest(SELECTABLE_TEXT_SELECTOR);

      let nextX = event.clientX;
      let nextY = event.clientY;

      if (interactiveTarget && root.contains(interactiveTarget)) {
        const bounds = interactiveTarget.getBoundingClientRect();
        const isCompactTarget = bounds.width <= 320 && bounds.height <= 160;
        const isExplicitTarget = interactiveTarget.hasAttribute(
          "data-cursor-orb-target",
        );
        const magneticPull = isExplicitTarget
          ? 0.24
          : isCompactTarget
            ? 0.16
            : 0.06;
        const magneticLimit = isExplicitTarget ? 10 : isCompactTarget ? 6 : 4;
        const deltaX =
          (bounds.left + bounds.width / 2 - event.clientX) * magneticPull;
        const deltaY =
          (bounds.top + bounds.height / 2 - event.clientY) * magneticPull;

        nextX += clamp(deltaX, -magneticLimit, magneticLimit);
        nextY += clamp(deltaY, -magneticLimit, magneticLimit);
      }

      target.x = nextX;
      target.y = nextY;

      if (!hasPosition) {
        current.x = target.x;
        current.y = target.y;
        orb.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
        hasPosition = true;
      }

      orb.dataset.visible = "true";
      orb.dataset.suppressed =
        nativeCursorTarget || selectableTextTarget ? "true" : "false";
      orb.dataset.interactive =
        interactiveTarget && root.contains(interactiveTarget) ? "true" : "false";
      orb.dataset.surfaceTone = resolveSurfaceTone(toneSource);

      if (surface && root.contains(surface)) {
        if (surface !== activeSurface) {
          hideSurfaceLight();
          activeSurface = surface;
          activeSurface.style.setProperty("--cursor-light-opacity", "1");
        }
      } else {
        hideSurfaceLight();
      }

      scheduleFrame();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && orb.dataset.suppressed !== "true") {
        orb.dataset.pressed = "true";
      }
    };

    const handlePointerUp = () => {
      orb.dataset.pressed = "false";
    };

    const handlePointerExit = () => {
      cancelFrame();
      hideSurfaceLight();
      hideOrb();
    };

    const handleScroll = () => {
      hideSurfaceLight();
      hideOrb();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        handlePointerExit();
      }
    };

    const enable = () => {
      if (enabled || !capability.matches) {
        return;
      }

      enabled = true;
      root.addEventListener("pointermove", handlePointerMove, { passive: true });
      root.addEventListener("pointerdown", handlePointerDown, { passive: true });
      root.addEventListener("pointerleave", handlePointerExit);
      window.addEventListener("pointerup", handlePointerUp, { passive: true });
      window.addEventListener("pointercancel", handlePointerExit, {
        passive: true,
      });
      window.addEventListener("blur", handlePointerExit);
      window.addEventListener("scroll", handleScroll, { passive: true });
      document.addEventListener("visibilitychange", handleVisibilityChange);
    };

    const disable = () => {
      if (!enabled) {
        return;
      }

      enabled = false;
      handlePointerExit();
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerdown", handlePointerDown);
      root.removeEventListener("pointerleave", handlePointerExit);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerExit);
      window.removeEventListener("blur", handlePointerExit);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    const syncCapability = () => {
      if (capability.matches) {
        enable();
      } else {
        disable();
      }
    };

    syncCapability();
    capability.addEventListener("change", syncCapability);

    return () => {
      capability.removeEventListener("change", syncCapability);
      disable();
      cancelFrame();
    };
  }, []);

  return (
    <span
      ref={orbRef}
      className={styles.cursorOrb}
      aria-hidden="true"
      data-visible="false"
      data-interactive="false"
      data-pressed="false"
      data-suppressed="false"
      data-surface-tone="dark"
    >
      <span className={styles.cursorOrbLens} />
    </span>
  );
}

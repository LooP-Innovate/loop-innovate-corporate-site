"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { PRIMARY_NAVIGATION } from "@/lib/site/site-content";
import styles from "./site.module.css";

type SiteHeaderProps = {
  currentPath?: string;
};

type NavLinksProps = SiteHeaderProps & {
  onNavigate?: () => void;
};

function NavLinks({ currentPath, onNavigate }: NavLinksProps) {
  return (
    <>
      {PRIMARY_NAVIGATION.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={currentPath === item.href ? "page" : undefined}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function SiteHeader({ currentPath }: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const mobileNavigationRef = useRef<HTMLDetailsElement>(null);
  const closeMobileNavigation = useCallback(() => {
    if (mobileNavigationRef.current) {
      mobileNavigationRef.current.open = false;
    }
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 64.001rem)");
    const orientationQuery = window.matchMedia("(orientation: landscape)");
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileNavigation();
      }
    };

    desktopQuery.addEventListener("change", closeMobileNavigation);
    orientationQuery.addEventListener("change", closeMobileNavigation);
    window.addEventListener("orientationchange", closeMobileNavigation);
    window.addEventListener("keydown", handleEscape);

    return () => {
      desktopQuery.removeEventListener("change", closeMobileNavigation);
      orientationQuery.removeEventListener("change", closeMobileNavigation);
      window.removeEventListener("orientationchange", closeMobileNavigation);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeMobileNavigation]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    let frameId = 0;
    const syncSurface = () => {
      const corporateSurface = document.querySelector<HTMLElement>(
        "[data-corporate-surface]",
      );
      const returnExit = document.querySelector<HTMLElement>(
        "[data-return-exit-progress]",
      );

      const headerBoundary = header.getBoundingClientRect().bottom;
      const corporateBounds = corporateSurface?.getBoundingClientRect();
      const returnBounds = returnExit?.getBoundingClientRect();
      const returnExitErosion = Number(
        returnExit?.dataset.returnExitErosion ?? 0,
      );
      const corporateIsLight = Boolean(
        corporateBounds &&
          corporateBounds.top <= headerBoundary + 2 &&
          corporateBounds.bottom > headerBoundary,
      );
      const returnExitIsLight = Boolean(
        returnBounds &&
          returnBounds.top <= headerBoundary + 2 &&
          returnBounds.bottom > headerBoundary &&
          returnExitErosion >= 0.55,
      );

      header.dataset.surface =
        corporateIsLight || returnExitIsLight ? "light" : "dark";
    };
    const scheduleSurfaceSync = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(() => {
          syncSurface();
          frameId = window.requestAnimationFrame(() => {
            frameId = 0;
            syncSurface();
          });
        });
      }
    };

    scheduleSurfaceSync();
    window.addEventListener("scroll", scheduleSurfaceSync, { passive: true });
    window.addEventListener("resize", scheduleSurfaceSync);
    window.addEventListener("orientationchange", scheduleSurfaceSync);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleSurfaceSync);
      window.removeEventListener("resize", scheduleSurfaceSync);
      window.removeEventListener("orientationchange", scheduleSurfaceSync);
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.siteHeader} data-surface="dark">
      <div className={styles.headerInner}>
        <Link className={styles.wordmark} href="/" aria-label="LOOP Innovate ホーム">
          <Image
            className={`${styles.brandLogo} ${styles.brandLogoWhite}`}
            src="/brand/loop-combination-white.png"
            alt=""
            width={392}
            height={72}
            priority
          />
          <Image
            className={`${styles.brandLogo} ${styles.brandLogoFullColor}`}
            src="/brand/loop-combination-full-color.png"
            alt=""
            width={392}
            height={72}
          />
        </Link>

        <nav className={styles.desktopNavigation} aria-label="メインナビゲーション">
          <NavLinks currentPath={currentPath} />
          <Link
            className={styles.headerContact}
            href="/contact"
            aria-current={currentPath === "/contact" ? "page" : undefined}
          >
            Contact
          </Link>
        </nav>

        <details ref={mobileNavigationRef} className={styles.mobileNavigation}>
          <summary>
            <span>Menu</span>
            <i aria-hidden="true" />
          </summary>
          <nav aria-label="モバイルナビゲーション">
            <NavLinks
              currentPath={currentPath}
              onNavigate={closeMobileNavigation}
            />
            <Link
              href="/contact"
              aria-current={currentPath === "/contact" ? "page" : undefined}
              onClick={closeMobileNavigation}
            >
              Contact
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

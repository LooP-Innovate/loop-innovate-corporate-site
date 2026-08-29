export function clampProgress(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function calculateScrollProgress(
  scrollPosition: number,
  sectionStart: number,
  sectionHeight: number,
  viewportHeight: number,
): number {
  const scrollableDistance = Math.max(1, sectionHeight - viewportHeight);
  return clampProgress((scrollPosition - sectionStart) / scrollableDistance);
}

import { useRef, useCallback } from 'react';

/*
 * useSwipeDown — detects a downward swipe gesture on whatever element you
 * attach the returned handlers to, and calls `onTrigger`.
 *
 * IMPORTANT: attach this to OUR OWN chrome (a header bar, a grabber handle) —
 * never to a wrapper that contains a cross-origin <iframe>. Browsers route
 * touch input for cross-origin frame content to the frame itself; those
 * events never bubble to the parent page, so a swipe started over the framed
 * article is invisible to us. A swipe started on the header/handle above the
 * iframe is our own DOM and works normally.
 */
export function useSwipeDown(onTrigger, threshold = 70) {
  const start = useRef(null);

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (!start.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.current.x;
    const dy = t.clientY - start.current.y;
    start.current = null;
    if (dy > threshold && dy > Math.abs(dx) * 1.5) onTrigger();
  }, [onTrigger, threshold]);

  return { onTouchStart, onTouchEnd };
}

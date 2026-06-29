"use client";

import { useEffect } from "react";

/**
 * SnapScrollProvider — wheel/touch-driven section snap.
 *
 * Behavior mirrors the FullPage-style reference: one wheel gesture advances
 * exactly one section, with a short cooldown between snaps. Native scroll is
 * preserved INSIDE sections that are taller than the viewport — the snap only
 * engages at section boundaries. That way a tall content section (e.g., the
 * Developer 10-card grid) stays fully readable without being clipped to 100vh.
 *
 * - desktop: wheel events
 * - touch: touchstart/touchend swipe detection
 * - keyboard: PageUp/PageDown/ArrowUp/ArrowDown/Home/End
 * - respects prefers-reduced-motion (disabled entirely)
 *
 * The page's existing reveal/exit animations (CinematicSection, CardConstruct,
 * parallax) continue to work because they're driven by ScrollTrigger, which
 * fires on the smooth programmatic scroll.
 */

const NAV_OFFSET = 80; // floating navbar height + small margin
const SNAP_LOCKOUT_MS = 750; // cooldown after each snap
const WHEEL_THRESHOLD = 12; // ignore tiny wheel deltas (trackpad jitter)
const EDGE_TOLERANCE = 6; // px tolerance for "at edge" detection
const TOUCH_THRESHOLD = 30; // px swipe to count as a section change

function isSnapTarget(el) {
  // Sections (data-cinematic) + footer. Skip the fixed navbar.
  if (!el) return false;
  if (el.hasAttribute("data-cinematic")) return true;
  if (el.tagName === "FOOTER") return true;
  return false;
}

function getSnapTargets() {
  const all = Array.from(
    document.querySelectorAll("[data-cinematic], footer")
  ).filter(isSnapTarget);
  // sort by document position
  all.sort((a, b) => {
    const pos = a.compareDocumentPosition(b);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });
  return all;
}

function indexFromScroll(targets) {
  const probe = window.scrollY + NAV_OFFSET + 24;
  for (let i = targets.length - 1; i >= 0; i--) {
    if (targets[i].offsetTop <= probe) return i;
  }
  return 0;
}

export default function SnapScrollProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let lockUntil = 0;
    let cachedTargets = [];
    let refreshScheduled = false;

    const refresh = () => {
      cachedTargets = getSnapTargets();
      refreshScheduled = false;
    };
    const scheduleRefresh = () => {
      if (refreshScheduled) return;
      refreshScheduled = true;
      requestAnimationFrame(refresh);
    };

    refresh();

    const ro = new ResizeObserver(scheduleRefresh);
    cachedTargets.forEach((el) => ro.observe(el));
    window.addEventListener("resize", scheduleRefresh);

    const snapTo = (index) => {
      const target = cachedTargets[index];
      if (!target) return;
      window.scrollTo({
        top: Math.max(0, target.offsetTop - NAV_OFFSET),
        behavior: "smooth",
      });
      lockUntil = Date.now() + SNAP_LOCKOUT_MS;
    };

    // --- WHEEL ---
    const onWheel = (e) => {
      if (Date.now() < lockUntil) {
        e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      const idx = indexFromScroll(cachedTargets);
      const section = cachedTargets[idx];
      if (!section) return;

      const r = section.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const goingDown = e.deltaY > 0;

      // If section extends past viewport, allow native internal scroll.
      // - going down: section bottom not yet at viewport bottom → keep scrolling inside
      // - going up: section top not yet at viewport top → keep scrolling inside
      if (goingDown && r.bottom > viewportH + EDGE_TOLERANCE) {
        return; // let native scroll handle
      }
      if (!goingDown && r.top < NAV_OFFSET - EDGE_TOLERANCE) {
        return; // let native scroll handle
      }

      // At section boundary — snap to next / prev
      e.preventDefault();
      if (goingDown && idx < cachedTargets.length - 1) {
        snapTo(idx + 1);
      } else if (!goingDown && idx > 0) {
        snapTo(idx - 1);
      }
    };

    // --- TOUCH ---
    let touchStartY = 0;
    let touchStartTime = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };
    const onTouchEnd = (e) => {
      if (Date.now() < lockUntil) return;
      const endY = (e.changedTouches[0] || {}).clientY ?? touchStartY;
      const dy = touchStartY - endY; // positive = swiped up = scrolling down
      const dt = Date.now() - touchStartTime;
      if (Math.abs(dy) < TOUCH_THRESHOLD || dt > 600) return;

      const idx = indexFromScroll(cachedTargets);
      const section = cachedTargets[idx];
      if (!section) return;
      const r = section.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const goingDown = dy > 0;

      // Same boundary check as wheel
      if (goingDown && r.bottom > viewportH + EDGE_TOLERANCE) return;
      if (!goingDown && r.top < NAV_OFFSET - EDGE_TOLERANCE) return;

      if (goingDown && idx < cachedTargets.length - 1) snapTo(idx + 1);
      else if (!goingDown && idx > 0) snapTo(idx - 1);
    };

    // --- KEYBOARD ---
    const onKey = (e) => {
      // don't hijack typing
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) return;
      if (Date.now() < lockUntil) return;

      const idx = indexFromScroll(cachedTargets);
      switch (e.key) {
        case "PageDown":
        case " ":
          if (e.key === " " && e.shiftKey) {
            e.preventDefault();
            if (idx > 0) snapTo(idx - 1);
          } else {
            e.preventDefault();
            if (idx < cachedTargets.length - 1) snapTo(idx + 1);
          }
          break;
        case "PageUp":
          e.preventDefault();
          if (idx > 0) snapTo(idx - 1);
          break;
        case "Home":
          e.preventDefault();
          snapTo(0);
          break;
        case "End":
          e.preventDefault();
          snapTo(cachedTargets.length - 1);
          break;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", scheduleRefresh);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}

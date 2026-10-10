import { useEffect, useRef, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const CHARACTER_INTERVAL_MS = 30;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

type ProjectTypingTitleProps = {
  active: boolean;
  title: string;
  detail: string;
  delayMs?: number;
};

export function ProjectTypingTitle({ active, title, detail, delayMs = 0 }: ProjectTypingTitleProps) {
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState(() =>
    prefersReducedMotion() ? title : "",
  );
  const [visibleDetail, setVisibleDetail] = useState(() =>
    prefersReducedMotion() ? detail : "",
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const updatePreference = () => {
      setReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setVisibleTitle(title);
        setVisibleDetail(detail);
      }
    };

    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);
    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, [detail, title]);

  useEffect(() => {
    if (!active) {
      setIsVisible(false);
      return;
    }
    if (reducedMotion) return;

    const element = titleRef.current;
    if (!element) return;

    if (typeof window.IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [active, reducedMotion, title]);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleTitle(title);
      setVisibleDetail(detail);
      return;
    }
    if (!active || !isVisible) {
      setVisibleTitle("");
      setVisibleDetail("");
      return;
    }

    let titleIndex = 0;
    let detailIndex = 0;
    let intervalId: number | undefined;
    setVisibleTitle("");
    setVisibleDetail("");

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (titleIndex < title.length) {
          titleIndex += 1;
          setVisibleTitle(title.slice(0, titleIndex));
          return;
        }

        if (detailIndex < detail.length) {
          detailIndex += 1;
          setVisibleDetail(detail.slice(0, detailIndex));
          return;
        }

        if (intervalId !== undefined) {
          window.clearInterval(intervalId);
          intervalId = undefined;
        }
      }, CHARACTER_INTERVAL_MS);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [active, delayMs, detail, isVisible, reducedMotion, title]);

  const titleIsTyping = active && isVisible && !reducedMotion && visibleTitle.length < title.length;
  const titleHasFinished = visibleTitle.length >= title.length;

  return (
    <>
      <span ref={titleRef} className="visual-code-title" aria-hidden="true">
        {visibleTitle}
        {titleIsTyping ? <span className="visual-code-caret" /> : null}
      </span>
      <span className="visual-code-detail" aria-hidden="true">
        <span className="visual-code-detail-prefix">→ </span>
        {visibleDetail}
        {active && isVisible && !reducedMotion && titleHasFinished ? <span className="visual-code-caret" /> : null}
      </span>
    </>
  );
}

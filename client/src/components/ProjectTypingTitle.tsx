import { useEffect, useRef, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const CHARACTER_INTERVAL_MS = 32;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

type ProjectTypingTitleProps = {
  title: string;
  delayMs?: number;
};

export function ProjectTypingTitle({ title, delayMs = 0 }: ProjectTypingTitleProps) {
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState(() =>
    prefersReducedMotion() ? title : "",
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const updatePreference = () => {
      setReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) setVisibleTitle(title);
    };

    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);
    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, [title]);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleTitle(title);
      return;
    }

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
  }, [reducedMotion, title]);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleTitle(title);
      return;
    }
    if (!isVisible) {
      setVisibleTitle("");
      return;
    }

    let characterIndex = 0;
    let intervalId: number | undefined;
    setVisibleTitle("");

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        characterIndex += 1;
        setVisibleTitle(title.slice(0, characterIndex));

        if (characterIndex >= title.length && intervalId !== undefined) {
          window.clearInterval(intervalId);
          intervalId = undefined;
        }
      }, CHARACTER_INTERVAL_MS);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [delayMs, isVisible, reducedMotion, title]);

  return (
    <span ref={titleRef} className="visual-code-title" aria-hidden="true">
      {visibleTitle}
      <span className="visual-code-caret" aria-hidden="true" />
    </span>
  );
}

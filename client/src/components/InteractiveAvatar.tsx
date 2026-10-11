import { createAvatar, type AvatarController } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import { useCallback, useEffect, useRef, useState } from "react";
import avatarDefinition from "../assets/portfolio-avatar.avatar.json";

export type AvatarMood = "idle" | "listening" | "thinking" | "happy" | "confused";
type AvatarVariant = "chat" | "hero" | "launcher";

const AvatarLabMascot = createAvatar(avatarDefinition);

const animationForMood: Record<AvatarMood, keyof typeof avatarDefinition.animations> = {
  idle: "idle",
  listening: "listening",
  thinking: "thinking",
  happy: "celebrate",
  confused: "confused",
};

const expressionForMood: Record<AvatarMood, keyof typeof avatarDefinition.expressions> = {
  idle: "neutral",
  listening: "small-attentive",
  thinking: "curious-left",
  happy: "joyful-wide",
  confused: "skeptical-left",
};

function pointerExpression(look: { x: number; y: number }): keyof typeof avatarDefinition.expressions {
  if (look.x > 1.4) return "far-right-glance";
  if (look.x < -1.4) return "curious-left";
  if (look.y < -1.1) return "upward-side-glance";
  if (look.y > 1.1) return "downward-gaze";
  return "neutral";
}

export function InteractiveAvatar({
  mood,
  variant = "chat",
  look = { x: 0, y: 0 },
  followPointer = false,
}: {
  mood: AvatarMood;
  variant?: AvatarVariant;
  look?: { x: number; y: number };
  followPointer?: boolean;
}) {
  const avatar = useRef<AvatarController>(null);
  const avatarElement = useRef<HTMLElement | null>(null);
  const setAvatarElement = useCallback((element: HTMLElement | null) => {
    avatarElement.current = element;
  }, []);
  const hasMounted = useRef(false);
  const previousMood = useRef(mood);
  const [reduceMotion, setReduceMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const previousReduceMotion = useRef(reduceMotion);
  const [pointerLook, setPointerLook] = useState({ x: 0, y: 0 });
  const gaze = variant === "hero"
    ? pointerExpression(look)
    : followPointer
      ? pointerExpression(pointerLook)
      : "neutral";

  const moodCopy = variant === "hero"
    ? {
        idle: "LS signal online",
        listening: "Tracking your next idea",
        thinking: "Compiling a sharper answer",
        happy: "Build signal: clear",
        confused: "Signal unclear — let's reframe",
      }[mood]
    : {
        idle: "Ready when you are",
        listening: "I’m reading that…",
        thinking: "Finding the right signal…",
        happy: "Here’s what I found",
        confused: "Try asking about Lekhya’s portfolio",
      }[mood];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!followPointer) return;

    let frame = 0;
    let latestX = 0;
    let latestY = 0;
    const resetGaze = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      latestX = 0;
      latestY = 0;
      setPointerLook({ x: 0, y: 0 });
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = avatarElement.current?.getBoundingClientRect();
      const centerX = bounds ? bounds.left + bounds.width / 2 : window.innerWidth / 2;
      const centerY = bounds ? bounds.top + bounds.height / 2 : window.innerHeight / 2;
      const rangeX = Math.max(bounds?.width ?? 0, window.innerWidth / 10, 1);
      const rangeY = Math.max(bounds?.height ?? 0, window.innerHeight / 10, 1);
      latestX = Math.max(-1, Math.min(1, (event.clientX - centerX) / rangeX));
      latestY = Math.max(-1, Math.min(1, (event.clientY - centerY) / rangeY));
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setPointerLook({ x: latestX * 4, y: latestY * 3 });
      });
    };
    const handlePointerExit = (event: PointerEvent) => {
      if (event.relatedTarget === null) resetGaze();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetGaze);
    document.addEventListener("pointerout", handlePointerExit);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetGaze);
      document.removeEventListener("pointerout", handlePointerExit);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [followPointer]);

  useEffect(() => {
    const moodChanged = previousMood.current !== mood;
    const motionPreferenceChanged = previousReduceMotion.current !== reduceMotion;
    previousMood.current = mood;
    previousReduceMotion.current = reduceMotion;

    if (!hasMounted.current) {
      hasMounted.current = true;
      if (variant === "hero" && mood === "idle" && !reduceMotion) return;
      if (mood === "idle") return;
      if (reduceMotion) {
        avatar.current?.setExpression(expressionForMood[mood]);
      } else {
        avatar.current?.play(animationForMood[mood]);
      }
      return;
    }

    const followsPointer = variant === "hero" || followPointer;
    if (followsPointer && mood === "idle" && gaze !== "neutral") {
      avatar.current?.setExpression(gaze);
      return;
    }

    if (followsPointer && mood !== "idle" && !moodChanged && !motionPreferenceChanged) return;

    if (reduceMotion) {
      avatar.current?.setExpression(expressionForMood[mood]);
      return;
    }

    avatar.current?.play(animationForMood[mood]);
  }, [followPointer, gaze, mood, reduceMotion, variant]);

  const initialPlayback = reduceMotion
    ? ({ defaultExpression: expressionForMood[mood] } as const)
    : ({ defaultAnimation: variant === "hero" ? "waking" : "idle" } as const);

  if (variant === "launcher") {
    return (
      <span ref={setAvatarElement} className={`chat-avatar-renderer avatar-${mood}`} aria-hidden="true">
        <AvatarLabMascot
          {...initialPlayback}
          ref={avatar}
          size="100%"
          className="assistant-avatar assistant-avatar-compact"
          ariaLabel="Get to know Lekhya assistant mascot"
        />
      </span>
    );
  }

  return (
    <div
      className={`assistant-avatar-card avatar-${mood}`}
      role="group"
      aria-label={`Interactive portfolio avatar: ${moodCopy}`}
    >
      <div ref={followPointer ? setAvatarElement : undefined} className="assistant-avatar-stage">
        <span className="assistant-avatar-orbit orbit-a" aria-hidden="true" />
        <span className="assistant-avatar-orbit orbit-b" aria-hidden="true" />
        <AvatarLabMascot
          {...initialPlayback}
          ref={avatar}
          size="100%"
          className="assistant-avatar"
          ariaLabel="Lekhya's lime-green animated portfolio mascot"
          onAnimationEnd={animation => {
            if (variant === "hero" && animation === "waking" && mood === "idle" && !reduceMotion) {
              avatar.current?.play("idle");
            }
          }}
        />
      </div>
      <div className="assistant-avatar-copy">
        <span><i /> {variant === "hero" ? "LS / INTERFACE" : "AVATAR SIGNAL"}</span>
        <strong>{moodCopy}</strong>
        {variant === "hero" ? <small>A living layer of the portfolio</small> : null}
      </div>
    </div>
  );
}

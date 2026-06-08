import { useEffect, useRef, RefObject } from "react";

export function useTilt<T extends HTMLElement>(
  maxTilt = 6,
  glowSize = 300
): RefObject<T> {
  const ref = useRef<T>(null!);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disable on touch
    if ("ontouchstart" in window) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const enter = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.setProperty("--tilt-glow-x", `${x}px`);
      el.style.setProperty("--tilt-glow-y", `${y}px`);
    };

    const leave = () => {
      el.style.transform = "";
    };

    el.addEventListener("mousemove", enter);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mousemove", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [maxTilt, glowSize]);

  return ref;
}

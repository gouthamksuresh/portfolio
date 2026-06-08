import { useEffect, useRef, useState } from "react";

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h2" | "h3" | "span";
}

export function GlitchText({ text, className = "", as: Tag = "span" }: GlitchTextProps) {
  const [display, setDisplay] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const hasGlitched = useRef(false);
  const ref = useRef<HTMLElement>(null);

  // Glitch on reveal (IntersectionObserver)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasGlitched.current) {
          hasGlitched.current = true;
          triggerGlitch();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text]);

  const triggerGlitch = () => {
    setIsGlitching(true);
    const duration = 400;
    const interval = 30;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const progress = elapsed / duration;

      const result = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          // Characters resolve left to right
          if (i / text.length < progress) return char;
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join("");

      setDisplay(result);

      if (elapsed >= duration) {
        clearInterval(timer);
        setDisplay(text);
        setIsGlitching(false);
      }
    }, interval);
  };

  return (
    <Tag
      ref={ref as any}
      className={`${className} ${isGlitching ? "text-glow" : ""}`}
      onMouseEnter={() => {
        if (!isGlitching) triggerGlitch();
      }}
    >
      {display}
    </Tag>
  );
}

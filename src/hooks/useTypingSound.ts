import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "typing-sound-muted";

export function useTypingSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, muted ? "1" : "0"); } catch {}
  }, [muted]);

  const click = useCallback(() => {
    if (muted) return;
    // Skip on mobile / reduced motion
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window && window.innerWidth < 768) return;

    try {
      if (!ctxRef.current) ctxRef.current = new AudioContext();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Short percussive click
      osc.type = "square";
      osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }, [muted]);

  const toggle = useCallback(() => setMuted((m) => !m), []);

  return { click, muted, toggle };
}

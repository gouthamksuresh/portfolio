import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-0.5" aria-hidden="true">
      <div
        className="h-full bg-primary shadow-[0_0_8px_hsl(var(--terminal-green)/0.8)]"
        style={{ width: `${progress}%`, transition: "width 50ms linear" }}
      />
    </div>
  );
}

import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 35, startDelay = 0) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut("");
    setDone(false);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const start = setTimeout(function tick() {
      if (i <= text.length) {
        setOut(text.slice(0, i));
        i++;
        timer = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(timer!);
    };
  }, [text, speed, startDelay]);
  return { text: out, done };
}

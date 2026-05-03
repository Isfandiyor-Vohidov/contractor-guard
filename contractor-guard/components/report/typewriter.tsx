"use client";

import { useState, useEffect } from "react";

export function Typewriter({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm min-h-[200px]">
      {displayed}
      <span className="animate-pulse">▌</span>
    </pre>
  );
}
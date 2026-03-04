"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

const SLIDES = ["slide-01", "slide-02", "slide-03", "slide-04", "slide-05"];

export default function DownloadButton() {
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const [progress, setProgress] = useState(0);

  async function downloadAll() {
    setStatus("working");
    setProgress(0);

    for (let i = 0; i < SLIDES.length; i++) {
      const id = SLIDES[i];
      const el = document.getElementById(id);
      if (!el) continue;

      // Run twice — first pass embeds resources, second pass renders correctly
      await toPng(el, { pixelRatio: 2, skipFonts: true });
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `gunung-ocun-${id}.png`;
      a.click();

      setProgress(i + 1);

      // Small delay so browsers don't block multiple downloads
      await new Promise((r) => setTimeout(r, 400));
    }

    setStatus("done");
    setTimeout(() => setStatus("idle"), 3000);
  }

  const label =
    status === "idle"
      ? "↓ Download all 5 slides"
      : status === "working"
      ? `Exporting ${progress} / ${SLIDES.length}…`
      : "✓ All slides downloaded";

  return (
    <button
      onClick={downloadAll}
      disabled={status === "working"}
      style={{
        marginTop: 32,
        padding: "14px 28px",
        background: status === "done" ? "#2F7939" : "#0F172A",
        color: "white",
        fontFamily: "JetBrains Mono",
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        border: "none",
        cursor: status === "working" ? "not-allowed" : "pointer",
        opacity: status === "working" ? 0.6 : 1,
        transition: "background 0.2s",
      }}
    >
      {label}
    </button>
  );
}

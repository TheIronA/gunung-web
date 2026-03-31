"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

const SLIDES = ["slide-01", "slide-02", "slide-03", "slide-04"];

const FONTS = [
  { family: "Inter", weight: 300, file: "/fonts/Inter-300.ttf" },
  { family: "Inter", weight: 400, file: "/fonts/Inter-400.ttf" },
  { family: "Inter", weight: 500, file: "/fonts/Inter-500.ttf" },
  { family: "Inter", weight: 600, file: "/fonts/Inter-600.ttf" },
  { family: "Inter", weight: 700, file: "/fonts/Inter-700.ttf" },
  { family: "JetBrains Mono", weight: 400, file: "/fonts/JetBrainsMono-400.ttf" },
  { family: "JetBrains Mono", weight: 500, file: "/fonts/JetBrainsMono-500.ttf" },
  { family: "Space Grotesk", weight: 400, file: "/fonts/SpaceGrotesk-400.ttf" },
  { family: "Space Grotesk", weight: 500, file: "/fonts/SpaceGrotesk-500.ttf" },
  { family: "Space Grotesk", weight: 600, file: "/fonts/SpaceGrotesk-600.ttf" },
  { family: "Space Grotesk", weight: 700, file: "/fonts/SpaceGrotesk-700.ttf" },
];

function bufToBase64(buf: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

let cachedFontCSS: string | null = null;

async function buildFontEmbedCSS(): Promise<string> {
  if (cachedFontCSS) return cachedFontCSS;
  const rules = await Promise.all(
    FONTS.map(async ({ family, weight, file }) => {
      const res = await fetch(file);
      const b64 = bufToBase64(await res.arrayBuffer());
      return `@font-face { font-family: '${family}'; font-style: normal; font-weight: ${weight}; src: url('data:font/truetype;base64,${b64}') format('truetype'); }`;
    })
  );
  cachedFontCSS = rules.join("\n");
  return cachedFontCSS;
}

export default function DownloadButton() {
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const [progress, setProgress] = useState(0);

  async function downloadAll() {
    setStatus("working");
    setProgress(0);

    const fontEmbedCSS = await buildFontEmbedCSS();

    for (let i = 0; i < SLIDES.length; i++) {
      const id = SLIDES[i];
      const el = document.getElementById(id);
      if (!el) continue;

      await toPng(el, { pixelRatio: 2, fontEmbedCSS });
      const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true, fontEmbedCSS });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `gunung-who-${id}.png`;
      a.click();

      setProgress(i + 1);
      await new Promise((r) => setTimeout(r, 400));
    }

    setStatus("done");
    setTimeout(() => setStatus("idle"), 3000);
  }

  const label =
    status === "idle"
      ? "↓ Download all 4 slides"
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

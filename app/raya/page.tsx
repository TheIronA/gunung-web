import type { Metadata } from "next";
import DownloadButton from "./DownloadButton";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "Selamat Hari Raya 2026 | Internal",
};

// ─── Ketupat (woven diamond rice cake) ───
function Ketupat({
  size = 120,
  color = "white",
  opacity = 0.15,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  const c = 50;
  const r = 45;
  const step = 9;
  const lines: string[] = [];
  for (let t = -r + step; t < r; t += step) {
    const span = r - Math.abs(t);
    if (span > 0) {
      lines.push(`M ${c - span} ${c + t} L ${c + span} ${c + t}`);
      lines.push(`M ${c + t} ${c - span} L ${c + t} ${c + span}`);
    }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
      <polygon
        points={`${c},${c - r} ${c + r},${c} ${c},${c + r} ${c - r},${c}`}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      {lines.map((d, i) => (
        <path key={i} d={d} stroke={color} strokeWidth="0.8" fill="none" />
      ))}
    </svg>
  );
}

// ─── Crescent moon (mask approach for clean cutout) ───
function Crescent({
  size = 100,
  color = "white",
  opacity = 0.22,
  maskId = "crescent-default",
}: {
  size?: number;
  color?: string;
  opacity?: number;
  maskId?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
      <defs>
        <mask id={maskId}>
          <circle cx="50" cy="50" r="36" fill="white" />
          <circle cx="65" cy="50" r="28" fill="black" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="36" fill={color} mask={`url(#${maskId})`} />
    </svg>
  );
}

// ─── 8-pointed star (bintang) ───
function OctaStar({
  size = 80,
  color = "white",
  opacity = 0.15,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  const c = 50;
  const ro = 38;
  const ri = 22;
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = ((i * 45 - 90) * Math.PI) / 180;
    const rad = i % 2 === 0 ? ro : ri;
    pts.push(`${c + rad * Math.cos(angle)},${c + rad * Math.sin(angle)}`);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
      <polygon points={pts.join(" ")} fill={color} />
    </svg>
  );
}

// ─── Slide header ───
function SlideHeader({ n, light }: { n: string; light?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "28px 32px 0",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            background: light ? "#C89B3C" : "#1E5C35",
            borderRadius: "50%",
          }}
        />
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 10,
            color: light ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.3)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.12em",
          }}
        >
          GUNUNG CLIMBING
        </span>
      </div>
      <span
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: 10,
          color: light ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.25)",
        }}
      >
        {n} / 03
      </span>
    </div>
  );
}

export default function RayaPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#CBD5E1",
        padding: "48px 16px 64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Instructions */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <p
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 11,
            color: "#64748B",
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
          }}
        >
          Internal · Raya 2026 Instagram post
        </p>
        <p
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 11,
            color: "#94A3B8",
            marginTop: 4,
          }}
        >
          Browser zoom 100% · Screenshot each card individually
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          alignItems: "center",
        }}
      >
        {/* ══════════════════════════════════════
            SLIDE 01 — Main Greeting  (deep forest green)
        ══════════════════════════════════════ */}
        <div
          id="slide-01"
          style={{
            width: 540,
            height: 675,
            background: "#0A1F10",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gold top strip */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #C89B3C, #E8C86A, #C89B3C)",
              pointerEvents: "none",
            }}
          />

          {/* Ketupat watermarks */}
          <div
            style={{
              position: "absolute",
              top: 30,
              right: -20,
              pointerEvents: "none",
            }}
          >
            <Ketupat size={200} color="#C89B3C" opacity={0.11} />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 50,
              left: -30,
              pointerEvents: "none",
            }}
          >
            <Ketupat size={170} color="#C89B3C" opacity={0.07} />
          </div>
          <div
            style={{
              position: "absolute",
              top: 220,
              left: 28,
              pointerEvents: "none",
            }}
          >
            <Ketupat size={54} color="#C89B3C" opacity={0.12} />
          </div>

          {/* Crescent moon + star top-left */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 22,
              pointerEvents: "none",
            }}
          >
            <Crescent size={92} color="#C89B3C" opacity={0.28} maskId="crescent-s1" />
          </div>
          <div
            style={{
              position: "absolute",
              top: 42,
              left: 116,
              pointerEvents: "none",
            }}
          >
            <OctaStar size={22} color="#C89B3C" opacity={0.5} />
          </div>

          <SlideHeader n="01" light />

          {/* Main content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 36px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 10,
                color: "#C89B3C",
                textTransform: "uppercase" as const,
                letterSpacing: "0.2em",
                margin: "0 0 22px",
              }}
            >
              Dari Keluarga Gunung
            </p>

            <h1
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 64,
                lineHeight: 1.0,
                color: "white",
                margin: "0 0 2px",
              }}
            >
              Selamat
            </h1>
            <h1
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 64,
                lineHeight: 1.0,
                color: "#C89B3C",
                margin: "0 0 6px",
              }}
            >
              Hari Raya
            </h1>
            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 400,
                fontSize: 24,
                color: "rgba(255,255,255,0.65)",
                margin: "0 0 32px",
                letterSpacing: "0.04em",
              }}
            >
              Aidilfitri 1447H
            </h2>

            {/* Gold separator */}
            <div
              style={{
                width: 56,
                height: 2,
                background: "#C89B3C",
                marginBottom: 22,
              }}
            />

            <p
              style={{
                fontFamily: "Inter",
                fontSize: 22,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.85)",
                margin: 0,
                letterSpacing: "0.02em",
              }}
            >
              Maaf Zahir &amp; Batin
            </p>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid rgba(200,155,60,0.18)",
              padding: "16px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <span
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 9,
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
              }}
            >
              gunungclimbing.my
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    background: i === 1 ? "#C89B3C" : "rgba(200,155,60,0.28)",
                    transform: "rotate(45deg)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 02 — Message  (warm cream / parchment)
        ══════════════════════════════════════ */}
        <div
          id="slide-02"
          style={{
            width: 540,
            height: 675,
            background: "#FDF6E3",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle grid texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(30,92,53,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,92,53,0.04) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              pointerEvents: "none",
            }}
          />

          {/* Large ketupat watermark */}
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: -10,
              pointerEvents: "none",
            }}
          >
            <Ketupat size={280} color="#1E5C35" opacity={0.06} />
          </div>

          {/* Scattered small stars */}
          <div
            style={{
              position: "absolute",
              top: 58,
              right: 42,
              pointerEvents: "none",
            }}
          >
            <OctaStar size={28} color="#C89B3C" opacity={0.3} />
          </div>
          <div
            style={{
              position: "absolute",
              top: 185,
              left: 26,
              pointerEvents: "none",
            }}
          >
            <OctaStar size={18} color="#1E5C35" opacity={0.2} />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 130,
              right: 52,
              pointerEvents: "none",
            }}
          >
            <OctaStar size={16} color="#C89B3C" opacity={0.22} />
          </div>

          <SlideHeader n="02" />

          {/* Gold vertical accent bar */}
          <div
            style={{
              position: "absolute",
              left: 32,
              top: "50%",
              transform: "translateY(-50%)",
              width: 4,
              height: 90,
              background: "#C89B3C",
              zIndex: 1,
            }}
          />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 40px 0 52px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 10,
                color: "#1E5C35",
                textTransform: "uppercase" as const,
                letterSpacing: "0.14em",
                margin: "0 0 18px",
              }}
            >
              A message from us
            </p>

            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 38,
                lineHeight: 1.15,
                color: "#0A1F10",
                margin: "0 0 26px",
              }}
            >
              This season,
              <br />
              <span style={{ color: "#1E5C35" }}>rest &amp; reset.</span>
            </h2>

            <p
              style={{
                fontFamily: "Inter",
                fontSize: 15,
                lineHeight: 1.8,
                color: "#475569",
                margin: "0 0 20px",
                maxWidth: 390,
              }}
            >
              Raya is a time for family, forgiveness, and a full
              plate of rendang. The walls will still be there when
              you get back — for now, celebrate well.
            </p>

            <p
              style={{
                fontFamily: "Inter",
                fontStyle: "italic",
                fontSize: 14,
                lineHeight: 1.7,
                color: "#94A3B8",
                margin: 0,
                maxWidth: 360,
              }}
            >
              Wishing all our Malaysian climbers and their families
              a blessed and joyful Hari Raya.
            </p>
          </div>

          <div
            style={{
              background: "#0A1F10",
              padding: "13px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.38)",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
              }}
            >
              gunungclimbing.my
            </span>
            <div style={{ width: 28, height: 3, background: "#C89B3C" }} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 03 — See you on the wall  (forest green)
        ══════════════════════════════════════ */}
        <div
          id="slide-03"
          style={{
            width: 540,
            height: 675,
            background: "#1E5C35",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Vertical line texture */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 40 + i * 56,
                width: 1,
                background: "rgba(255,255,255,0.05)",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Ketupat watermarks */}
          <div
            style={{
              position: "absolute",
              right: -10,
              top: 50,
              pointerEvents: "none",
            }}
          >
            <Ketupat size={185} color="white" opacity={0.08} />
          </div>
          <div
            style={{
              position: "absolute",
              left: -20,
              bottom: 90,
              pointerEvents: "none",
            }}
          >
            <Ketupat size={130} color="white" opacity={0.06} />
          </div>

          {/* Small star top-left */}
          <div
            style={{
              position: "absolute",
              top: 55,
              left: 38,
              pointerEvents: "none",
            }}
          >
            <OctaStar size={20} color="#C89B3C" opacity={0.55} />
          </div>

          {/* Gold corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 80,
              height: 80,
              background: "#C89B3C",
              clipPath: "polygon(100% 0, 100% 100%, 0 0)",
              pointerEvents: "none",
            }}
          />

          <SlideHeader n="03" light />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 32px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Pill badges */}
            <div style={{ display: "flex", gap: 10, marginBottom: 26 }}>
              {["Rest.", "Reflect.", "Recharge."].map((word, i) => (
                <div
                  key={i}
                  style={{
                    background:
                      i === 0 ? "#C89B3C" : "rgba(255,255,255,0.1)",
                    padding: "6px 14px",
                    border:
                      i !== 0 ? "1px solid rgba(255,255,255,0.2)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 11,
                      color: i === 0 ? "#0A1F10" : "rgba(255,255,255,0.55)",
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {word}
                  </span>
                </div>
              ))}
            </div>

            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 56,
                lineHeight: 1.05,
                color: "white",
                margin: "0 0 16px",
              }}
            >
              See you on
              <br />
              <span style={{ color: "#C89B3C" }}>the wall.</span>
            </h2>

            <p
              style={{
                fontFamily: "Inter",
                fontSize: 15,
                color: "rgba(255,255,255,0.58)",
                lineHeight: 1.7,
                maxWidth: 350,
                marginBottom: 44,
              }}
            >
              Shop stays open over Raya. Striker QC &amp; Jett QC still
              available — new stock dropping as we grow.
            </p>
          </div>

          {/* Gold CTA block */}
          <div
            style={{
              margin: "0 32px 32px",
              background: "#C89B3C",
              padding: "18px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  color: "#0A1F10",
                  fontSize: 15,
                  margin: 0,
                }}
              >
                gunungclimbing.my/store
              </p>
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 10,
                  color: "rgba(0,0,0,0.45)",
                  marginTop: 5,
                  letterSpacing: "0.06em",
                }}
              >
                STRIKER QC · JETT QC · OPEN OVER RAYA
              </p>
            </div>
            <div
              style={{
                width: 36,
                height: 36,
                border: "2px solid rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#0A1F10", fontSize: 18 }}>→</span>
            </div>
          </div>
        </div>
      </div>

      <DownloadButton />

      <p
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: 10,
          color: "#94A3B8",
          textAlign: "center",
          marginTop: 40,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
        }}
      >
        noindex · internal use only
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import DownloadButton from "./DownloadButton";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "Who We Are | Internal",
};

// CSS gradients don't render in SVG foreignObject (Chromium bug) — use SVG data URI instead
const CROSSHATCH_BG = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="29" height="29">' +
  '<line x1="0" y1="29" x2="29" y2="0" stroke="white" stroke-opacity="0.02" stroke-width="1"/>' +
  '<line x1="0" y1="0" x2="29" y2="29" stroke="white" stroke-opacity="0.02" stroke-width="1"/>' +
  '</svg>'
)}")`;

// ─── Decorative SVG: Mountain silhouette (Gunung = mountain) ───
function MountainSilhouette({
  color = "white",
  opacity = 0.1,
  width = 400,
}: {
  color?: string;
  opacity?: number;
  width?: number;
}) {
  const h = Math.round(width * 0.58);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 400 232"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <path
        fill={color}
        d="M0 232 L85 95 L130 140 L200 8 L270 118 L315 72 L400 232 Z"
      />
    </svg>
  );
}

// ─── Decorative SVG: Shoe silhouette ───
function ShoeOutline({
  color = "white",
  opacity = 0.12,
  width = 320,
}: {
  color?: string;
  opacity?: number;
  width?: number;
}) {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <path
        fill={color}
        d="M2 15s0-3 2-3c.68 0 1.46-.05 2.28-.18C7.2 12.54 8.5 13 10 13h.25l-1.69-1.71c.35-.11.69-.24 1.03-.38l1.91 1.91c.39-.08.75-.19 1.08-.32l-2.03-2.05c.3-.17.59-.34.88-.54L13.5 12c.3-.21.54-.44.75-.68l-2.03-2.03c.24-.22.48-.46.7-.71l1.87 1.87c.12-.31.21-.62.21-.95c0-.85-.45-1.61-1.16-2.22c.05-.09.11-.18.16-.28l1.53-.77c.85.94 2.61 1.61 4.72 1.74l.05.03h.7s1 1 1 4.5c0 .57 0 1.07-.04 1.5H19c-1.1 0-2.42.26-3.7.5c-1.18.26-2.4.5-3.3.5zm19 2s.58 0 .86-2H19c-2 0-5 1-7 1H2.28c.34.6.98 1 1.72 1z"
      />
    </svg>
  );
}

// ─── Decorative SVG: Climber figure ───
function ClimberFigure({
  color = "white",
  opacity = 0.12,
  height: figH = 200,
}: {
  color?: string;
  opacity?: number;
  height?: number;
}) {
  return (
    <svg
      width={figH}
      height={figH}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <path
        fill={color}
        d="m90.67 25l96.83 144.3l-1.5-24.6L105.7 25zM131 25l156.2 123.1l-5-41.8l121.5 129.5L435 487h51.7V25zm70.5 98.2l3.6 61.8c-5 7.4-24.1 32.5-56.9 36.8c-4.1.5-7.2 4-7.2 8.2c0 0-.8 37.2 45.7 83.1l34.7-55.7c-7-7.3-14-16.5-21.5-28.7l27.6-30.1c1.8-1.9 2.5-4.4 2.1-7L218 121.4c-2.7-11.2-16.9-7.5-16.5 1.8m-69.8 27c-9.2 0-16.9 3.8-20.8 10.3c-7.1 11.8-.1 29.1 15.8 38.6s34.5 7.4 41.5-4.5s-.1-29.1-15.9-38.5c-6.5-3.8-13.7-5.9-20.6-5.9m155.5 76.2l-42.6 32.7l-12.1 80.1c12.4 3.1 25.4 4 38.3 2.2l22.5-3.1l45.9 50.4c1.9 2 4.6 3 7.3 2.6l29-4c11.2-3.3 7.2-16.5-1.4-16.6l-21.4.7l-30.6-66.1c-1.1-2.2-3-3.8-5.3-4.5l-38.7-11.2l22.6-19.4L353 289c4.7 1.5 9.3-1.1 10.8-5.3l10.5-34c1.7-11.3-11.7-13.6-15.5-6l-8.1 17.1l-53.9-34.8c-3.2-1.8-6.8-1.5-9.6.4M223.9 285l-24.3 38.9c5.3 3.8 11 7.1 16.9 9.7zm19 74.3L274.4 487h12.8l-31.4-127.4q-6.45.15-12.9-.3"
      />
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
        padding: "30px 32px 0",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            background: light ? "white" : "#2F7939",
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
        {n} / 04
      </span>
    </div>
  );
}

export default function WhoWeArePage() {
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
          Internal · Instagram carousel assets
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
            SLIDE 01 — Hook  (dark navy)
        ══════════════════════════════════════ */}
        <div
          id="slide-01"
          style={{
            width: 540,
            height: 675,
            background: "#0F172A",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Cross-hatch texture */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage:
                CROSSHATCH_BG,
              pointerEvents: "none",
            }}
          />

          {/* Left green accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 6,
              height: "100%",
              background: "#2F7939",
              pointerEvents: "none",
            }}
          />

          {/* Mountain watermark */}
          <div
            style={{
              position: "absolute",
              left: -20,
              bottom: -8,
              pointerEvents: "none",
            }}
          >
            <MountainSilhouette color="white" opacity={0.07} width={500} />
          </div>

          <SlideHeader n="01" light />

          {/* Main content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 36px 0 42px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 10,
                color: "#2F7939",
                textTransform: "uppercase" as const,
                letterSpacing: "0.2em",
                margin: "0 0 20px",
              }}
            >
              Kuala Lumpur, Malaysia
            </p>

            <h1
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 72,
                lineHeight: 0.95,
                color: "white",
                margin: "0 0 6px",
              }}
            >
              We&apos;re
            </h1>
            <h1
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 72,
                lineHeight: 0.95,
                color: "#2F7939",
                margin: "0 0 32px",
              }}
            >
              Gunung.
            </h1>

            <div
              style={{
                width: 48,
                height: 2,
                background: "rgba(255,255,255,0.2)",
                marginBottom: 24,
              }}
            />

            <p
              style={{
                fontFamily: "Inter",
                fontSize: 17,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.65,
                maxWidth: 360,
                margin: 0,
              }}
            >
              A climbing shop run by Malaysian climbers. Built because we
              got tired of paying too much for gear that wasn&apos;t even here.
            </p>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              margin: "0 32px",
              padding: "18px 0 32px",
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
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
              }}
            >
              gunungclimbing.my
            </span>
            <span
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 9,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.06em",
              }}
            >
              Swipe →
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 02 — The Problem  (white)
        ══════════════════════════════════════ */}
        <div
          id="slide-02"
          style={{
            width: 540,
            height: 675,
            background: "#F8FAFC",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Dot grid texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(15,23,42,0.09) 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
              pointerEvents: "none",
            }}
          />

          {/* Shoe watermark */}
          <div
            style={{
              position: "absolute",
              right: -40,
              bottom: 40,
              transform: "rotate(-6deg)",
              pointerEvents: "none",
            }}
          >
            <ShoeOutline color="#0F172A" opacity={0.06} width={380} />
          </div>

          <SlideHeader n="02" />

          <div
            style={{
              padding: "22px 36px 0",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 42,
                lineHeight: 1.1,
                color: "#0F172A",
                margin: 0,
              }}
            >
              It started with
              <br />
              <span style={{ color: "#2F7939" }}>a frustration.</span>
            </h2>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 36px",
              gap: 20,
              position: "relative",
              zIndex: 1,
            }}
          >
            {[
              {
                n: "01",
                title: "Hard to find",
                desc: "Limited stock at 2–3 local retailers. If they didn't have your size or model, your options were: wait, settle, or order from overseas and wait 3–4 weeks.",
              },
              {
                n: "02",
                title: "Marked up",
                desc: "Local retail: RM 465 for Ocún Striker. We import the same shoe direct for RM 399. The markup pays for middlemen, not quality.",
              },
              {
                n: "03",
                title: "So we went direct",
                desc: "We contacted climbing shoe manufacturers, got wholesale accounts, and started importing ourselves. Same shoes, RM 66–96 cheaper. No local distributor markup, no retail overhead.",
              },
            ].map((item) => (
              <div
                key={item.n}
                style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#0F172A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      color: "#2F7939",
                      fontSize: 12,
                      fontFamily: "JetBrains Mono",
                      fontWeight: 700,
                    }}
                  >
                    {item.n}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "Space Grotesk",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#0F172A",
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontSize: 13,
                      color: "#64748B",
                      lineHeight: 1.55,
                      margin: "4px 0 0",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#0F172A",
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
            <div style={{ width: 28, height: 3, background: "#2F7939" }} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 03 — What we do  (green)
        ══════════════════════════════════════ */}
        <div
          id="slide-03"
          style={{
            width: 540,
            height: 675,
            background: "#0F172A",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Horizontal line texture (different feel from vertical) */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 40 + i * 55,
                height: 1,
                background: "rgba(255,255,255,0.04)",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Green bottom accent bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "#2F7939",
              pointerEvents: "none",
            }}
          />

          {/* Climber watermark */}
          <div
            style={{
              position: "absolute",
              right: -20,
              bottom: 50,
              pointerEvents: "none",
            }}
          >
            <ClimberFigure color="white" opacity={0.1} height={400} />
          </div>

          <SlideHeader n="03" light />

          <div
            style={{
              padding: "24px 36px 0",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 44,
                lineHeight: 1.08,
                color: "white",
                margin: 0,
              }}
            >
              What we
              <br />
              <span style={{ color: "#2F7939" }}>actually do.</span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 14,
                lineHeight: 1.6,
                marginTop: 12,
                fontFamily: "Inter",
                maxWidth: 340,
              }}
            >
              We import climbing gear direct from the source and sell it to
              Malaysian climbers, no middlemen.
            </p>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 36px",
              gap: 16,
              position: "relative",
              zIndex: 1,
            }}
          >
            {[
              {
                label: "Direct importer",
                desc: "We buy wholesale from manufacturers and ship straight to you. No local distributor in between.",
              },
              {
                label: "Honest pricing",
                desc: "We import direct and sell direct. One less markup layer between you and the manufacturer.",
              },
              {
                label: "Curated gear",
                desc: "Only what we'd actually climb in. Starting with Ocún, expanding our line.",
              },
              {
                label: "Growing with you",
                desc: "More brands and more models coming as the local climbing scene grows.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  borderLeft: "3px solid #2F7939",
                  paddingLeft: 16,
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "Space Grotesk",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.5,
                      margin: "3px 0 0",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "rgba(47,121,57,0.15)",
              borderTop: "1px solid rgba(47,121,57,0.3)",
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
              Starting with Ocún · More coming
            </span>
            <div style={{ width: 28, height: 3, background: "white" }} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 04 — Come climb with us  (dark navy)
        ══════════════════════════════════════ */}
        <div
          id="slide-04"
          style={{
            width: 540,
            height: 675,
            background: "#0F172A",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Cross-hatch texture on upper portion */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 460,
              backgroundImage:
                CROSSHATCH_BG,
              pointerEvents: "none",
            }}
          />

          {/* Green horizon band */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 215,
              background: "#2F7939",
              pointerEvents: "none",
            }}
          />

          {/* Mountain silhouette sitting on the horizon */}
          <div
            style={{
              position: "absolute",
              left: -20,
              bottom: 205,
              pointerEvents: "none",
            }}
          >
            <MountainSilhouette color="white" opacity={0.13} width={580} />
          </div>

          <SlideHeader n="04" light />

          {/* Heading in the navy zone */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 36px",
              position: "relative",
              zIndex: 1,
              paddingBottom: 200,
            }}
          >
            <p
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.2em",
                margin: "0 0 20px",
              }}
            >
              Let&apos;s go
            </p>

            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 64,
                lineHeight: 1.0,
                color: "white",
                margin: "0 0 8px",
              }}
            >
              Come climb
            </h2>
            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 64,
                lineHeight: 1.0,
                color: "white",
                margin: 0,
              }}
            >
              with us.
            </h2>
          </div>

          {/* CTA content in the green horizon band */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 215,
              zIndex: 2,
              padding: "22px 36px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 14,
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.6,
                maxWidth: 360,
                margin: 0,
              }}
            >
              Just getting started. Follow along as we expand our line and
              grow the Malaysian climbing scene.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "Space Grotesk",
                    fontWeight: 700,
                    color: "white",
                    fontSize: 16,
                    margin: 0,
                  }}
                >
                  gunungclimbing.my/store
                </p>
                <p
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.55)",
                    marginTop: 5,
                    letterSpacing: "0.06em",
                  }}
                >
                  STRIKER QC · JETT QC · LIMITED STOCK
                </p>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "2px solid rgba(255,255,255,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontSize: 18 }}>→</span>
              </div>
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

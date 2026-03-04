import type { Metadata } from "next";
import DownloadButton from "./DownloadButton";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "Why Ocun? | Internal",
};

// ─── Decorative SVG: Shoe silhouette (mdi/shoe-sneaker) ───
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

// ─── Decorative SVG: Climber on wall (game-icons/mountain-climbing) ───
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
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          GUNUNG × OCUN
        </span>
      </div>
      <span
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: 10,
          color: light ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.25)",
        }}
      >
        {n} / 05
      </span>
    </div>
  );
}

export default function OcunWhyPage() {
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
            textTransform: "uppercase",
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
            SLIDE 01 — Meet Ocun  (dark navy)
        ══════════════════════════════════════ */}
        <div
          id="slide-01"
          style={{
            width: 540,
            height: 675,
            background: "#0F172A",
            border: "3px solid #0F172A",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Shoe watermark — bottom right */}
          <div
            style={{
              position: "absolute",
              right: -70,
              bottom: 10,
              transform: "rotate(-8deg)",
              pointerEvents: "none",
            }}
          >
            <ShoeOutline color="white" opacity={0.09} width={430} />
          </div>

          <SlideHeader n="01" light />

          {/* Main content */}
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
            <div style={{ marginBottom: 20 }}>
              <span
                style={{
                  background: "#2F7939",
                  color: "white",
                  fontSize: 10,
                  fontFamily: "JetBrains Mono",
                  letterSpacing: "0.12em",
                  padding: "5px 12px",
                  textTransform: "uppercase",
                }}
              >
                Czech Republic · Est. 1993
              </span>
            </div>

            <h1
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 68,
                lineHeight: 1.0,
                color: "white",
                margin: 0,
              }}
            >
              Meet
              <br />
              <span style={{ color: "#2F7939" }}>Ocun.</span>
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 16,
                lineHeight: 1.65,
                marginTop: 20,
                fontFamily: "Inter",
                maxWidth: 360,
              }}
            >
              The brand Europe&apos;s been climbing in for 30 years.
            </p>
          </div>

          {/* Fact list */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              margin: "0 32px",
              padding: "20px 0 32px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {[
              "Czech craftsmanship dating back to 1993",
              "CAT rubber & multiple lasts for every foot",
              "Official Ocún distributor for Malaysia",
            ].map((fact, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: i < 2 ? 10 : 0,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid #2F7939",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <div style={{ width: 6, height: 6, background: "#2F7939" }} />
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 13,
                    fontFamily: "Inter",
                    lineHeight: 1.5,
                  }}
                >
                  {fact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 02 — Why Ocun  (white)
        ══════════════════════════════════════ */}
        <div
          id="slide-02"
          style={{
            width: 540,
            height: 675,
            background: "#FFFFFF",
            border: "3px solid #0F172A",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              pointerEvents: "none",
            }}
          />

          {/* Climber watermark — right side */}
          <div
            style={{
              position: "absolute",
              right: -20,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <ClimberFigure color="#0F172A" opacity={0.07} height={450} />
          </div>

          <SlideHeader n="02" />

          <div
            style={{
              padding: "20px 32px 0",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 40,
                lineHeight: 1.1,
                color: "#0F172A",
                margin: 0,
              }}
            >
              Why Ocun
              <br />
              <span style={{ color: "#2F7939" }}>hits different.</span>
            </h2>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 32px",
              gap: 18,
              position: "relative",
              zIndex: 1,
              maxWidth: 400,
            }}
          >
            {[
              {
                label: "CAT Rubber",
                desc: "Grip that keeps up with La Sportiva and Scarpa",
              },
              {
                label: "Multiple Lasts",
                desc: "Narrow, regular, wide — a fit for every foot",
              },
              {
                label: "Czech Craftsmanship",
                desc: "Every pair handmade — not mass-produced",
              },
              {
                label: "Under the radar",
                desc: "30 years of reputation, barely known here yet",
              },
            ].map((feat, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
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
                      fontSize: 13,
                      fontFamily: "JetBrains Mono",
                      fontWeight: 700,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "Space Grotesk",
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#0F172A",
                      margin: 0,
                    }}
                  >
                    {feat.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontSize: 12,
                      color: "#64748B",
                      lineHeight: 1.45,
                      margin: "3px 0 0",
                    }}
                  >
                    {feat.desc}
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
                color: "rgba(255,255,255,0.4)",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              ocun.com × gunungclimbing.my
            </span>
            <div style={{ width: 28, height: 3, background: "#2F7939" }} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 03 — Made for your climb  (green)
        ══════════════════════════════════════ */}
        <div
          id="slide-03"
          style={{
            width: 540,
            height: 675,
            background: "#2F7939",
            border: "3px solid #0F172A",
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
                background: "rgba(255,255,255,0.06)",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Climber watermark — right side */}
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: 20,
              pointerEvents: "none",
            }}
          >
            <ClimberFigure color="white" opacity={0.15} height={400} />
          </div>

          <SlideHeader n="03" light />

          <div
            style={{
              padding: "24px 32px 0",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 46,
                lineHeight: 1.05,
                color: "white",
                margin: 0,
              }}
            >
              Two shoes.
              <br />
              Both in stock.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 14,
                lineHeight: 1.6,
                marginTop: 14,
                fontFamily: "Inter",
                maxWidth: 360,
              }}
            >
              We&apos;re starting with two — one for comfort, one for performance.
            </p>
          </div>

          {/* Two-shoe comparison */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              padding: "28px 32px",
              flex: 1,
              alignContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Striker QC */}
            <div
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.22)",
                padding: "20px 16px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                All-day / Gym
              </span>
              <p
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "white",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Striker QC
              </p>
              <div style={{ width: 24, height: 2, background: "rgba(255,255,255,0.3)" }} />
              {["Velcro closure", "Flat last", "All-day comfort", "Great for gym"].map((pt) => (
                <p
                  key={pt}
                  style={{
                    fontFamily: "Inter",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  — {pt}
                </p>
              ))}
            </div>

            {/* Jett QC */}
            <div
              style={{
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "20px 16px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                For performance
              </span>
              <p
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "white",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Jett QC
              </p>
              <div style={{ width: 24, height: 2, background: "rgba(255,255,255,0.3)" }} />
              {["Velcro closure", "Moderate downturn", "Precision edging", "Gym & sport routes"].map((pt) => (
                <p
                  key={pt}
                  style={{
                    fontFamily: "Inter",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  — {pt}
                </p>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "rgba(0,0,0,0.18)",
              padding: "13px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Both available now at gunungclimbing.my
            </span>
            <div style={{ width: 28, height: 3, background: "white" }} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 04 — Who is Gunung  (white)
        ══════════════════════════════════════ */}
        <div
          id="slide-04"
          style={{
            width: 540,
            height: 675,
            background: "#FFFFFF",
            border: "3px solid #0F172A",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              pointerEvents: "none",
            }}
          />

          {/* Shoe watermark — bottom right */}
          <div
            style={{
              position: "absolute",
              right: -40,
              bottom: 30,
              transform: "rotate(-6deg)",
              pointerEvents: "none",
            }}
          >
            <ShoeOutline color="#0F172A" opacity={0.06} width={360} />
          </div>

          <SlideHeader n="04" />

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
            <p
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 10,
                color: "#2F7939",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 16,
              }}
            >
              Who we are
            </p>
            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 52,
                lineHeight: 1.0,
                color: "#0F172A",
                margin: "0 0 20px",
              }}
            >
              We&apos;re
              <br />
              <span style={{ color: "#2F7939" }}>Gunung.</span>
            </h2>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 15,
                color: "#475569",
                lineHeight: 1.7,
                maxWidth: 380,
                marginBottom: 28,
              }}
            >
              A climbing shop run by Malaysian climbers. We carry
              what we actually climb in — starting with Ocún.
            </p>
            {[
              "Official Ocún distributor for Malaysia",
              "Stocked locally, priced in RM",
              "More brands coming as we grow",
            ].map((pt, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: i < 2 ? 12 : 0,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    background: "#2F7939",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "Inter",
                    fontSize: 13,
                    color: "#334155",
                    lineHeight: 1.5,
                  }}
                >
                  {pt}
                </span>
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
                color: "rgba(255,255,255,0.4)",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              gunungclimbing.my
            </span>
            <div style={{ width: 28, height: 3, background: "#2F7939" }} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 05 — CTA closer  (dark navy)
        ══════════════════════════════════════ */}
        <div
          id="slide-05"
          style={{
            width: 540,
            height: 675,
            background: "#0F172A",
            border: "3px solid #0F172A",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Diagonal stripe texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 32px, rgba(255,255,255,0.025) 32px, rgba(255,255,255,0.025) 64px)",
              pointerEvents: "none",
            }}
          />

          {/* Green corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 80,
              height: 80,
              background: "#2F7939",
              clipPath: "polygon(100% 0, 100% 100%, 0 0)",
              pointerEvents: "none",
            }}
          />

          {/* Shoe watermark — bottom left */}
          <div
            style={{
              position: "absolute",
              left: -55,
              bottom: 55,
              transform: "scaleX(-1) rotate(-10deg)",
              pointerEvents: "none",
            }}
          >
            <ShoeOutline color="white" opacity={0.07} width={320} />
          </div>

          <SlideHeader n="05" light />

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
              Shop now.
            </h2>
            <p
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 600,
                fontSize: 22,
                color: "#2F7939",
                margin: "0 0 24px",
              }}
            >
              Striker QC &amp; Jett QC
            </p>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.65,
                maxWidth: 340,
                marginBottom: 36,
              }}
            >
              In stock now. More models and brands dropping as we grow.
            </p>
          </div>

          {/* CTA block */}
          <div
            style={{
              margin: "0 32px 32px",
              background: "#2F7939",
              padding: "20px 24px",
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
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 5,
                  letterSpacing: "0.06em",
                }}
              >
                STRIKER QC · JETT QC · IN STOCK
              </p>
            </div>
            <div
              style={{
                width: 36,
                height: 36,
                border: "2px solid rgba(255,255,255,0.3)",
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

      <DownloadButton />

      <p
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: 10,
          color: "#94A3B8",
          textAlign: "center",
          marginTop: 40,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        noindex · internal use only
      </p>
    </div>
  );
}

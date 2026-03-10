import type { Metadata } from "next";
import DownloadButton from "./DownloadButton";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "Striker QC Carousel | Internal",
};

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

// ─── Feature row used in Card 3 ───
function FeatureBlock({
  title,
  points,
  light,
}: {
  title: string;
  points: string[];
  light?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <p
        style={{
          fontFamily: "Space Grotesk",
          fontWeight: 700,
          fontSize: 13,
          color: light ? "white" : "#0F172A",
          margin: 0,
        }}
      >
        {title}
      </p>
      {points.map((pt) => (
        <p
          key={pt}
          style={{
            fontFamily: "Inter",
            fontSize: 11,
            color: light ? "rgba(255,255,255,0.6)" : "#64748B",
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          — {pt}
        </p>
      ))}
    </div>
  );
}

export default function StrikerQCPage() {
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
            SLIDE 01 — Hero  (dark navy)
        ══════════════════════════════════════ */}
        <div
          id="sq-01"
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
                "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.018) 40px, rgba(255,255,255,0.018) 80px)",
              pointerEvents: "none",
            }}
          />

          <SlideHeader n="01" light />

          {/* Split: text left / image right */}
          <div style={{ flex: 1, display: "flex", position: "relative", zIndex: 1 }}>
            {/* Text column */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 24px 0 32px",
                position: "relative",
                zIndex: 2,
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
                  Czech Republic · CAT 1.1 Rubber
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 64,
                  lineHeight: 1.0,
                  color: "white",
                  margin: 0,
                }}
              >
                Striker
                <br />
                <span style={{ color: "#2F7939" }}>QC.</span>
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 13,
                  lineHeight: 1.65,
                  marginTop: 16,
                  fontFamily: "Inter",
                }}
              >
                The all-day climbing shoe you didn&apos;t know existed.
              </p>
            </div>

            {/* Floating shoe image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/zsxl3btjoh.04835-STRIKER-QC-Green-Malachite-1-1--removebg-preview.png"
              alt="Striker QC Green Malachite"
              style={{
                position: "absolute",
                right: -30,
                bottom: -30,
                width: 300,
                objectFit: "contain",
                pointerEvents: "none",
                zIndex: 1,
                transform: "rotate(-8deg)",
              }}
            />
          </div>

          {/* Price + spec bar */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              margin: "0 32px",
              padding: "20px 0 32px",
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: "0 0 6px",
                }}
              >
                Direct import price
              </p>
              <p
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 40,
                  color: "#a3e5ac",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                RM 399
              </p>
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.25)",
                  margin: "6px 0 0",
                  letterSpacing: "0.06em",
                }}
              >
                Local retail: RM 465+
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
              {["Czech-made", "CAT 1.1 Rubber", "Flat Last"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 9,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "3px 8px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 02 — The Problem  (white)
        ══════════════════════════════════════ */}
        <div
          id="sq-02"
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
                fontSize: 36,
                lineHeight: 1.1,
                color: "#0F172A",
                margin: 0,
              }}
            >
              Most &ldquo;beginner&rdquo; shoes
              <br />
              <span style={{ color: "#2F7939" }}>miss the mark.</span>
            </h2>
          </div>

          {/* Split comparison */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              padding: "20px 32px",
              flex: 1,
              alignContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Too cheap */}
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                padding: "18px 16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 9,
                  color: "#DC2626",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Too Cheap · RM 200–300
              </span>
              <p
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#0F172A",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Rental-grade shoes
              </p>
              <div style={{ width: 20, height: 2, background: "#FECACA" }} />
              {[
                "Tears after 3 months",
                "Zero precision on holds",
                "No grip",
              ].map((pt) => (
                <p
                  key={pt}
                  style={{
                    fontFamily: "Inter",
                    fontSize: 11,
                    color: "#DC2626",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  — {pt}
                </p>
              ))}
            </div>

            {/* Too expensive */}
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                padding: "18px 16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 9,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Too Expensive · RM 500+
              </span>
              <p
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#0F172A",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Premium performance
              </p>
              <div style={{ width: 20, height: 2, background: "#CBD5E1" }} />
              {[
                "Overkill for V0–V5",
                "Aggressive fit = can't wear all day",
                "Paying for features you don't need yet",
              ].map((pt) => (
                <p
                  key={pt}
                  style={{
                    fontFamily: "Inter",
                    fontSize: 11,
                    color: "#64748B",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  — {pt}
                </p>
              ))}
            </div>
          </div>

          {/* Resolution bar */}
          <div
            style={{
              background: "#0F172A",
              padding: "18px 32px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 16,
                color: "#2F7939",
                margin: "0 0 4px",
              }}
            >
              Striker sits in the gap.
            </p>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Quality that lasts + comfort you can actually climb in all session.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 03 — Why Striker Works  (green)
        ══════════════════════════════════════ */}
        <div
          id="sq-03"
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

          {/* Shoe watermark */}
          <div
            style={{
              position: "absolute",
              right: -60,
              bottom: 20,
              transform: "rotate(-8deg)",
              pointerEvents: "none",
            }}
          >
            <ShoeOutline color="white" opacity={0.1} width={380} />
          </div>

          <SlideHeader n="03" light />

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
                fontSize: 42,
                lineHeight: 1.05,
                color: "white",
                margin: 0,
              }}
            >
              Built for
              <br />
              progression.
            </h2>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "20px 32px",
              gap: 20,
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Feature blocks */}
            <div
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.18)",
                padding: "14px 16px",
              }}
            >
              <FeatureBlock
                title="CAT 1.1 Rubber"
                points={[
                  "Sticky enough for volumes & slopers",
                  "Durable enough to last 6–12 months",
                  "Won't tear on textured holds",
                ]}
                light
              />
            </div>

            <div
              style={{
                background: "rgba(0,0,0,0.18)",
                border: "1px solid rgba(255,255,255,0.10)",
                padding: "14px 16px",
              }}
            >
              <FeatureBlock
                title="Flat Last + Mild Downturn"
                points={[
                  "All-day wearable across 2–3 hour sessions",
                  "Learn proper technique without foot pain",
                  "Precise enough for V5–V6",
                ]}
                light
              />
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.18)",
                padding: "14px 16px",
              }}
            >
              <FeatureBlock
                title="Velcro Closure"
                points={[
                  "Quick on/off between problems",
                  "Secure fit without pressure points",
                ]}
                light
              />
            </div>
          </div>

          <div
            style={{
              background: "rgba(0,0,0,0.22)",
              padding: "13px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Ideal for V0–V5 · gunungclimbing.my
            </span>
            <div style={{ width: 28, height: 3, background: "white" }} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SLIDE 04 — Price Breakdown  (white)
        ══════════════════════════════════════ */}
        <div
          id="sq-04"
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

          <SlideHeader n="04" />

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
                fontSize: 38,
                lineHeight: 1.1,
                color: "#0F172A",
                margin: 0,
              }}
            >
              Why RM 399
              <br />
              <span style={{ color: "#2F7939" }}>vs RM 465+ locally?</span>
            </h2>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 32px",
              gap: 16,
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Local retail chain */}
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                padding: "16px 20px",
              }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 9,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  margin: "0 0 10px",
                }}
              >
                Local retail
              </p>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 13,
                  color: "#475569",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Ocún <span style={{ color: "#CBD5E1" }}>→</span>{" "}
                <span style={{ color: "#94A3B8" }}>Distributor</span>{" "}
                <span style={{ color: "#CBD5E1" }}>→</span>{" "}
                <span style={{ color: "#94A3B8" }}>Local retailer</span>{" "}
                <span style={{ color: "#CBD5E1" }}>→</span> You
              </p>
              <p
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#64748B",
                  margin: "10px 0 0",
                }}
              >
                RM 465+
              </p>
            </div>

            {/* Gunung chain */}
            <div
              style={{
                background: "#0F172A",
                border: "1px solid #0F172A",
                padding: "16px 20px",
              }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 9,
                  color: "#2F7939",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  margin: "0 0 10px",
                }}
              >
                Gunung · Direct import
              </p>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Ocún{" "}
                <span style={{ color: "rgba(255,255,255,0.2)" }}>→</span>{" "}
                <span style={{ color: "rgba(255,255,255,0.6)" }}>Gunung</span>{" "}
                <span style={{ color: "rgba(255,255,255,0.2)" }}>→</span> You
              </p>
              <p
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#a3e5ac",
                  margin: "10px 0 0",
                }}
              >
                RM 399
              </p>
            </div>

            <p
              style={{
                fontFamily: "Inter",
                fontSize: 13,
                color: "#475569",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Same shoe. Same Czech quality. No distributor markup, no retail
              overhead. We import direct from Ocún and pass the savings to
              Malaysian climbers.{" "}
              <span
                style={{ fontFamily: "Space Grotesk", fontWeight: 700, color: "#0F172A" }}
              >
                Simple.
              </span>
            </p>
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
            SLIDE 05 — In Stock Now  (dark navy)
        ══════════════════════════════════════ */}
        <div
          id="sq-05"
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

          {/* Shoe watermark */}
          <div
            style={{
              position: "absolute",
              left: -55,
              bottom: 55,
              transform: "scaleX(-1) rotate(-10deg)",
              pointerEvents: "none",
            }}
          >
            <ShoeOutline color="white" opacity={0.06} width={320} />
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
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2
                  style={{
                    fontFamily: "Space Grotesk",
                    fontWeight: 700,
                    fontSize: 48,
                    lineHeight: 1.0,
                    color: "white",
                    margin: "0 0 4px",
                  }}
                >
                  Striker QC
                </h2>
                <p
                  style={{
                    fontFamily: "Space Grotesk",
                    fontWeight: 600,
                    fontSize: 26,
                    color: "#a3e5ac",
                    margin: 0,
                  }}
                >
                  RM 399
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/zsxl3btjoh.04835-STRIKER-QC-Green-Malachite-1-1--removebg-preview.png"
                alt="Striker QC"
                style={{ width: 150, objectFit: "contain", flexShrink: 0 }}
              />
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: "0 0 10px",
                }}
              >
                In stock — UK sizes
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"].map(
                  (sz) => (
                    <div
                      key={sz}
                      style={{
                        border: "1px solid rgba(47,121,57,0.5)",
                        background: "rgba(47,121,57,0.12)",
                        padding: "5px 10px",
                        fontFamily: "JetBrains Mono",
                        fontSize: 12,
                        color: "#a3e5ac",
                      }}
                    >
                      {sz}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Urgency */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "12px 16px",
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "white",
                  margin: "0 0 4px",
                }}
              >
                First batch = limited.
              </p>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                12 pairs left from initial order. Restock takes 2–3 weeks.
              </p>
            </div>

            <p
              style={{
                fontFamily: "Inter",
                fontSize: 13,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              DM your UK size to reserve.
              <br />
              Bank transfer or cash.
              <br />
              <br />
              Wrong size? Free exchange within 7 days*
              <br />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                *subject to available stock
              </span>
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
                STRIKER QC · RM 399 · LIMITED STOCK
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

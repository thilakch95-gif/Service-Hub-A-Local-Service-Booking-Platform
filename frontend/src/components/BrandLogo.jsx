import { useId } from "react";

const paletteByVariant = {
  app: {
    title: "var(--text-primary)",
    subtitle: "var(--text-secondary)",
    eyebrow: "var(--text-faint)",
    shellBackground:
      "linear-gradient(145deg, rgba(7,12,22,0.96), rgba(15,27,45,0.92) 62%, rgba(12,24,40,0.96))",
    shellBorder: "rgba(159,176,201,0.16)",
    shellShadow: "0 20px 42px rgba(2, 8, 23, 0.2)",
    shellInset: "rgba(255,255,255,0.06)",
    shellHighlight: "rgba(255,255,255,0.08)",
    ambientGlow:
      "radial-gradient(circle at 26% 22%, rgba(96,165,250,0.34), transparent 42%), radial-gradient(circle at 78% 78%, rgba(20,184,166,0.2), transparent 34%)",
    pinStart: "#60A5FA",
    pinEnd: "#14B8A6",
    pinOverlay: "rgba(255,255,255,0.18)",
    pinStroke: "rgba(255,255,255,0.14)",
    coreFill: "rgba(6,12,24,0.88)",
    coreStroke: "rgba(255,255,255,0.12)",
    check: "#F8FBFF",
    eyebrowDot: "linear-gradient(135deg, #60A5FA, #14B8A6)",
  },
  inverse: {
    title: "#F8FBFF",
    subtitle: "rgba(255,255,255,0.78)",
    eyebrow: "rgba(255,255,255,0.56)",
    shellBackground:
      "linear-gradient(145deg, rgba(8,16,30,0.76), rgba(14,28,48,0.62) 62%, rgba(10,18,34,0.78))",
    shellBorder: "rgba(255,255,255,0.14)",
    shellShadow: "0 24px 48px rgba(2, 8, 23, 0.24)",
    shellInset: "rgba(255,255,255,0.09)",
    shellHighlight: "rgba(255,255,255,0.11)",
    ambientGlow:
      "radial-gradient(circle at 26% 22%, rgba(96,165,250,0.42), transparent 42%), radial-gradient(circle at 78% 78%, rgba(45,212,191,0.24), transparent 34%)",
    pinStart: "#7DD3FC",
    pinEnd: "#2DD4BF",
    pinOverlay: "rgba(255,255,255,0.22)",
    pinStroke: "rgba(255,255,255,0.18)",
    coreFill: "rgba(8,15,29,0.86)",
    coreStroke: "rgba(255,255,255,0.16)",
    check: "#FFFFFF",
    eyebrowDot: "linear-gradient(135deg, #7DD3FC, #2DD4BF)",
  },
};

const ServicePlatformMark = ({ size, palette }) => {
  const gradientId = useId().replace(/:/g, "");
  const glowId = `${gradientId}-glow`;
  const pinId = `${gradientId}-pin`;

  return (
    <svg
      width={Math.round(size * 0.72)}
      height={Math.round(size * 0.72)}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ position: "relative", zIndex: 1 }}
    >
      <defs>
        <radialGradient id={glowId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.pinStart} stopOpacity="0.24" />
          <stop offset="1" stopColor={palette.pinEnd} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={pinId} x1="18" y1="12" x2="48" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.pinStart} />
          <stop offset="1" stopColor={palette.pinEnd} />
        </linearGradient>
      </defs>

      <circle cx="32" cy="31" r="18" fill={`url(#${glowId})`} />

      <path
        d="M32 8C22.6112 8 15 15.6112 15 25C15 37.0397 23.5879 45.6571 30.2696 52.75C31.2329 53.7723 32.7671 53.7723 33.7304 52.75C40.4121 45.6571 49 37.0397 49 25C49 15.6112 41.3888 8 32 8Z"
        fill={`url(#${pinId})`}
      />
      <path
        d="M32 8C22.6112 8 15 15.6112 15 25C15 37.0397 23.5879 45.6571 30.2696 52.75C31.2329 53.7723 32.7671 53.7723 33.7304 52.75C40.4121 45.6571 49 37.0397 49 25C49 15.6112 41.3888 8 32 8Z"
        stroke={palette.pinStroke}
        strokeWidth="1.2"
      />
      <path
        d="M24 15.6C26.6448 12.5333 30.1234 11 34.4358 11C37.5606 11 40.4945 11.9774 43.2375 13.9323"
        stroke={palette.pinOverlay}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <rect x="29.6" y="17.2" width="4.8" height="5.4" rx="1.4" fill={palette.coreFill} />
      <rect x="41.4" y="26.4" width="5.4" height="4.8" rx="1.4" fill={palette.coreFill} />
      <rect x="29.6" y="39.4" width="4.8" height="5.4" rx="1.4" fill={palette.coreFill} />
      <rect x="17.2" y="26.4" width="5.4" height="4.8" rx="1.4" fill={palette.coreFill} />

      <path
        d="M32 20.5L39.5 24.8V33.2L32 37.5L24.5 33.2V24.8L32 20.5Z"
        fill={palette.coreFill}
        stroke={palette.coreStroke}
        strokeWidth="1"
      />
      <path
        d="M27.7 29.7L30.7 32.7L36.5 26.9"
        stroke={palette.check}
        strokeWidth="3.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const BrandLogo = ({
  variant = "app",
  size = 52,
  title = "Local Service Finder",
  eyebrow = "Smart local support",
  subtitle = "Trusted help, right nearby",
  showSubtitle = true,
}) => {
  const palette = paletteByVariant[variant] || paletteByVariant.app;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
      <div
        aria-hidden="true"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${Math.round(size * 0.32)}px`,
          position: "relative",
          display: "grid",
          placeItems: "center",
          background: palette.shellBackground,
          border: `1px solid ${palette.shellBorder}`,
          boxShadow: palette.shellShadow,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: `${Math.round(size * 0.3)}px`,
            border: `1px solid ${palette.shellHighlight}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "14%",
            borderRadius: `${Math.round(size * 0.24)}px`,
            background: palette.shellInset,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: palette.ambientGlow,
          }}
        />

        <ServicePlatformMark size={size} palette={palette} />
      </div>

      <div style={{ minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: palette.eyebrow,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              background: palette.eyebrowDot,
              boxShadow: "0 0 0 4px rgba(96,165,250,0.08)",
              flexShrink: 0,
            }}
          />
          {eyebrow}
        </p>
        <div
          style={{
            margin: "6px 0 0",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            color: palette.title,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        {showSubtitle ? (
          <p
            style={{
              margin: "4px 0 0",
              color: palette.subtitle,
              fontSize: "13px",
              lineHeight: 1.45,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default BrandLogo;

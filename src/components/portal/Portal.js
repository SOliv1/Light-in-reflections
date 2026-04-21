import "./Portal.css";
import { useState, useEffect } from "react";

const SEASON_PORTAL_PALETTES = {
  winter: {
    shellGlow: "rgba(190, 220, 255, 0.24)",
    shellShadow: "rgba(130, 170, 230, 0.2)",
    coreHighlight: "rgba(245, 250, 255, 0.56)",
    coreMid: "rgba(196, 220, 255, 0.26)",
    coreEdge: "rgba(120, 152, 220, 0.12)",
    coreGlow: "rgba(176, 210, 255, 0.34)",
    shimmer: "rgba(214, 234, 255, 0.12)",
    shimmerBeam: "rgba(255, 255, 255, 0.42)",
    crescent: "rgba(255, 255, 255, 0.64)",
    displayBackdrop: "rgba(188, 222, 255, 0.2)",
    displayRing: "rgba(205, 228, 255, 0.22)",
  },
  spring: {
    shellGlow: "rgba(180, 235, 196, 0.24)",
    shellShadow: "rgba(116, 188, 145, 0.2)",
    coreHighlight: "rgba(247, 255, 249, 0.54)",
    coreMid: "rgba(188, 238, 204, 0.25)",
    coreEdge: "rgba(110, 184, 132, 0.12)",
    coreGlow: "rgba(156, 224, 184, 0.32)",
    shimmer: "rgba(214, 255, 226, 0.12)",
    shimmerBeam: "rgba(250, 255, 252, 0.4)",
    crescent: "rgba(251, 255, 252, 0.62)",
    displayBackdrop: "rgba(178, 234, 194, 0.2)",
    displayRing: "rgba(202, 245, 214, 0.22)",
  },
  summer: {
    shellGlow: "rgba(255, 220, 166, 0.24)",
    shellShadow: "rgba(222, 164, 82, 0.2)",
    coreHighlight: "rgba(255, 250, 236, 0.56)",
    coreMid: "rgba(255, 219, 156, 0.26)",
    coreEdge: "rgba(216, 152, 72, 0.12)",
    coreGlow: "rgba(255, 206, 132, 0.34)",
    shimmer: "rgba(255, 238, 202, 0.12)",
    shimmerBeam: "rgba(255, 252, 245, 0.42)",
    crescent: "rgba(255, 250, 240, 0.66)",
    displayBackdrop: "rgba(255, 220, 154, 0.2)",
    displayRing: "rgba(255, 230, 188, 0.22)",
  },
  autumn: {
    shellGlow: "rgba(255, 194, 164, 0.24)",
    shellShadow: "rgba(192, 118, 82, 0.2)",
    coreHighlight: "rgba(255, 244, 238, 0.56)",
    coreMid: "rgba(255, 194, 166, 0.24)",
    coreEdge: "rgba(188, 108, 72, 0.12)",
    coreGlow: "rgba(242, 166, 126, 0.32)",
    shimmer: "rgba(255, 224, 214, 0.12)",
    shimmerBeam: "rgba(255, 248, 245, 0.4)",
    crescent: "rgba(255, 248, 244, 0.62)",
    displayBackdrop: "rgba(246, 184, 158, 0.2)",
    displayRing: "rgba(255, 214, 196, 0.22)",
  },
  default: {
    shellGlow: "rgba(210, 222, 255, 0.22)",
    shellShadow: "rgba(160, 180, 235, 0.18)",
    coreHighlight: "rgba(248, 251, 255, 0.54)",
    coreMid: "rgba(206, 219, 255, 0.24)",
    coreEdge: "rgba(140, 160, 224, 0.12)",
    coreGlow: "rgba(186, 204, 255, 0.3)",
    shimmer: "rgba(228, 236, 255, 0.11)",
    shimmerBeam: "rgba(255, 255, 255, 0.38)",
    crescent: "rgba(255, 255, 255, 0.6)",
    displayBackdrop: "rgba(204, 220, 255, 0.18)",
    displayRing: "rgba(220, 230, 255, 0.18)",
  },
};

const MOOD_PORTAL_PALETTES = {
  stormy: {
    shellGlow: "rgba(126, 146, 182, 0.22)",
    shellShadow: "rgba(82, 96, 132, 0.22)",
    coreHighlight: "rgba(230, 238, 252, 0.46)",
    coreMid: "rgba(144, 168, 210, 0.22)",
    coreEdge: "rgba(82, 102, 150, 0.14)",
    coreGlow: "rgba(124, 154, 214, 0.28)",
    shimmer: "rgba(205, 220, 250, 0.1)",
    shimmerBeam: "rgba(245, 248, 255, 0.34)",
    crescent: "rgba(242, 248, 255, 0.52)",
    displayBackdrop: "rgba(126, 150, 192, 0.18)",
    displayRing: "rgba(164, 188, 228, 0.18)",
  },
  joyful: {
    shellGlow: "rgba(255, 220, 156, 0.24)",
    shellShadow: "rgba(235, 172, 88, 0.22)",
    coreHighlight: "rgba(255, 250, 236, 0.58)",
    coreMid: "rgba(255, 214, 136, 0.28)",
    coreEdge: "rgba(222, 154, 74, 0.14)",
    coreGlow: "rgba(255, 204, 120, 0.34)",
    shimmer: "rgba(255, 236, 194, 0.12)",
    shimmerBeam: "rgba(255, 250, 242, 0.44)",
    crescent: "rgba(255, 248, 236, 0.68)",
    displayBackdrop: "rgba(255, 214, 134, 0.2)",
    displayRing: "rgba(255, 228, 180, 0.22)",
  },
  reflective: {
    shellGlow: "rgba(210, 198, 255, 0.22)",
    shellShadow: "rgba(144, 126, 214, 0.2)",
    coreHighlight: "rgba(250, 246, 255, 0.54)",
    coreMid: "rgba(202, 188, 255, 0.24)",
    coreEdge: "rgba(126, 110, 194, 0.12)",
    coreGlow: "rgba(192, 178, 255, 0.32)",
    shimmer: "rgba(236, 230, 255, 0.11)",
    shimmerBeam: "rgba(253, 249, 255, 0.42)",
    crescent: "rgba(250, 245, 255, 0.64)",
    displayBackdrop: "rgba(198, 184, 255, 0.18)",
    displayRing: "rgba(226, 216, 255, 0.2)",
  },
  natural: {
    shellGlow: "rgba(182, 224, 188, 0.22)",
    shellShadow: "rgba(118, 178, 126, 0.2)",
    coreHighlight: "rgba(245, 255, 246, 0.54)",
    coreMid: "rgba(184, 230, 188, 0.24)",
    coreEdge: "rgba(104, 168, 112, 0.12)",
    coreGlow: "rgba(162, 216, 170, 0.3)",
    shimmer: "rgba(218, 250, 220, 0.11)",
    shimmerBeam: "rgba(248, 255, 249, 0.4)",
    crescent: "rgba(247, 255, 248, 0.6)",
    displayBackdrop: "rgba(176, 220, 182, 0.18)",
    displayRing: "rgba(206, 238, 210, 0.2)",
  },
  calm: {
    shellGlow: "rgba(178, 222, 255, 0.22)",
    shellShadow: "rgba(116, 174, 224, 0.2)",
    coreHighlight: "rgba(245, 251, 255, 0.56)",
    coreMid: "rgba(180, 222, 255, 0.26)",
    coreEdge: "rgba(108, 166, 220, 0.12)",
    coreGlow: "rgba(160, 214, 255, 0.32)",
    shimmer: "rgba(222, 244, 255, 0.11)",
    shimmerBeam: "rgba(252, 255, 255, 0.42)",
    crescent: "rgba(250, 255, 255, 0.64)",
    displayBackdrop: "rgba(174, 222, 255, 0.18)",
    displayRing: "rgba(212, 236, 255, 0.2)",
  },
};

export function Portal({
  dayIndex,
  season,
  mood,
  type,
  onClick,
  macroMood,
  setMood,
  cueText,
  portalState,
  children
}) {
  const [showMoodMenu, setShowMoodMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [suppressHoverOpen, setSuppressHoverOpen] = useState(false);

  // ⭐ TIME LOGIC — clean, self‑contained
  const [ukTime, setUkTime] = useState("");

  useEffect(() => {
    const update = () => {
      setUkTime(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // ⭐ Mood / Season tint for the time
  const timeTint =
    mood === "stormy" ? "rgba(90,110,140,0.9)" :
    mood === "joyful" ? "rgba(255,215,130,0.95)" :
    mood === "reflective" ? "rgba(180,150,255,0.95)" :
    mood === "natural" ? "rgba(140,200,150,0.95)" :
    mood === "calm" ? "rgba(150,220,255,0.95)" :
    season === "winter" ? "rgba(160,200,255,0.95)" :
    season === "spring" ? "rgba(170,255,200,0.95)" :
    season === "summer" ? "rgba(255,220,150,0.95)" :
    season === "autumn" ? "rgba(255,180,140,0.95)" :
    "rgba(255,255,255,0.9)";

  const activePalette =
    MOOD_PORTAL_PALETTES[mood] ||
    SEASON_PORTAL_PALETTES[season] ||
    SEASON_PORTAL_PALETTES.default;

  const portalStyle = {
    "--portal-time-color": timeTint,
    "--portal-shell-glow": activePalette.shellGlow,
    "--portal-shell-shadow": activePalette.shellShadow,
    "--portal-core-highlight": activePalette.coreHighlight,
    "--portal-core-mid": activePalette.coreMid,
    "--portal-core-edge": activePalette.coreEdge,
    "--portal-core-glow": activePalette.coreGlow,
    "--portal-shimmer": activePalette.shimmer,
    "--portal-shimmer-beam": activePalette.shimmerBeam,
    "--portal-crescent": activePalette.crescent,
    "--portal-display-backdrop": activePalette.displayBackdrop,
    "--portal-display-ring": activePalette.displayRing,
  };

  // ⭐ EXISTING CLASS LOGIC (unchanged)
  const dayClass = dayIndex ? `portal--day-${dayIndex}` : "";
  const seasonClass = season ? `portal--season-${season}` : "";
  const moodClass = mood ? `portal--mood-${mood}` : "";
  const isExpandableMoodPortal = type === "mood";
  const isExpanded =
    isExpandableMoodPortal && (isPinnedOpen || (isHovered && !suppressHoverOpen));
  const hoverClass = isHovered ? "portal--hover" : "";

  const pulseClass =
    mood === "calm"
      ? "portal--pulse-slow"
      : mood === "reflective"
      ? "portal--pulse-medium"
      : "portal--pulse-fast";

  const typeClass = type ? `portal--${type}` : "";
  const glowClass = type === "mood" ? "portal--glow" : "";
  const awareClass = portalState === "aware" ? "portal--aware" : "";
  const expandedClass = isExpanded ? "portal--expanded" : "";
  const pinnedClass = isPinnedOpen ? "portal--pinned" : "";
  const interactionHint = !isExpandableMoodPortal
    ? ""
    : isPinnedOpen
    ? "Click again to close"
    : isHovered
    ? "Click to keep open"
    : "Hover or click to open";

  const classes = [
    "portal",
    typeClass,
    dayClass,
    seasonClass,
    moodClass,
    pulseClass,
    glowClass,
    awareClass,
    expandedClass,
    pinnedClass,
    hoverClass,
    macroMood
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = [
    "portal-container",
    isExpandableMoodPortal ? "portal-container--mood" : "",
    isExpanded ? "portal-container--expanded" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const handlePortalClick = () => {
    if (isExpandableMoodPortal) {
      if (isPinnedOpen) {
        setIsPinnedOpen(false);
        setSuppressHoverOpen(true);
      } else {
        setIsPinnedOpen(true);
        setSuppressHoverOpen(false);
      }
    }

    if (type === "mood" && setMood) {
      setMood(mood);
    }

    if (onClick) onClick();
  };

  const handlePortalKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePortalClick();
    }
  };

  return (
  <div className={containerClasses}>

    {/* ⭐ EXISTING MOOD ORB — now wired to mood */}
    <div
      className={`mood-orb ${showMoodMenu ? "open" : ""} mood-orb--${mood || "reset"}`}
      onClick={() => setShowMoodMenu(!showMoodMenu)}
    ></div>

    {/* ⭐ RADIAL MOOD MENU — unchanged */}
    {showMoodMenu && (
      <div className="mood-radial-menu">
        {["calm", "joyful", "stormy", "reflective", "natural"].map((m) => (
          <button
            key={m}
            className="mood-option"
            onClick={() => {
              setMood(m);
              setShowMoodMenu(false);
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}

        <button
          className="mood-reset"
          onClick={() => {
            setMood(null);
            setShowMoodMenu(false);
          }}
        >
          Reset
        </button>
      </div>
    )}

    {/* ⭐ PORTAL CORE */}
    <div
      className={classes}
      style={portalStyle}
      onClick={handlePortalClick}
      onMouseEnter={() => {
        setIsHovered(true);
        setSuppressHoverOpen(false);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setSuppressHoverOpen(false);
      }}
      onKeyDown={handlePortalKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-pressed={isPinnedOpen}
    >
      <div className="portal__core expanded-core">
        <div className="portal__crescent"></div>
        <div className="portal__shimmer"></div>

        <div className="portal__content">
          {children || (
            <div
              className="portal-time"
              style={{ color: timeTint }}
            >
              {ukTime}
            </div>
          )}
        </div>
      </div>
    </div>

    {interactionHint && (
      <div className="portal__interaction-hint">
        {interactionHint}
      </div>
    )}

    {/* ⭐ CUE TEXT */}
    {cueText && (
      <div className="portal__cue">
        {cueText}
      </div>
    )}

    {/* ⭐ SUBTITLE */}
    {portalState === "aware" && (
      <div className="portal-subtitle">
        The Door begins the story
      </div>
    )}
  </div>
);
}

export default Portal;
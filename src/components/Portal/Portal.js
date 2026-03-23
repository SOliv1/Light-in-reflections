import "./Portal.css";

export function Portal({
  dayIndex,
  season,
  mood,
  type,
  onClick,
  macroMood,
  setMood,
  cueText,
  portalState
}) {
  const dayClass = dayIndex ? `portal--day-${dayIndex}` : "";
  const seasonClass = season ? `portal--season-${season}` : "";
  const moodClass = mood ? `portal--mood-${mood}` : "";
  const hoverClass = document.body.classList.contains("portal-hovering")
    ? "portal--hover"
    : "";

  const pulseClass =
    mood === "calm"
      ? "portal--pulse-slow"
      : mood === "reflective"
      ? "portal--pulse-medium"
      : "portal--pulse-fast";

  const typeClass = type ? `portal--${type}` : "";
  const glowClass = type === "mood" ? "portal--glow" : "";
  const awareClass = portalState === "aware" ? "portal--aware" : "";

  const classes = [
    "portal",
    typeClass,
    dayClass,
    seasonClass,
    moodClass,
    pulseClass,
    glowClass,
    awareClass,
    hoverClass,
    macroMood
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="portal-container">
      <div
        className={classes}
        onClick={() => {
          if (type === "mood" && setMood) {
            setMood(mood);
          }
          if (onClick) onClick();
        }}
      >
        <div className="portal__core">
          <div className="portal__crescent"></div>
          <div className="portal__shimmer"></div>
        </div>
      </div>

      {/* ⭐ CUE TEXT — now visible */}
      {cueText && (
        <div className="portal__cue">
          {cueText}
        </div>
      )}

      {/* ⭐ SUBTITLE — now visible */}
      {portalState === "aware" && (
        <div className="portal-subtitle">
          You can change the ending if you want.
        </div>
      )}
    </div>
  );
}

export default Portal;

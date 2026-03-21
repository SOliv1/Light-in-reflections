import "./Portal.css";

export function Portal({
  dayIndex,
  season,
  mood,
  cueText,
  type,
  onClick,
  macroMood,
  setMood,   // ← added here
  portalState
}) {
  // 1. Build the base day class (1–7)
  const dayClass = dayIndex ? `portal--day-${dayIndex}` : "";

  // 2. Build the seasonal tint class
  const seasonClass = season ? `portal--season-${season}` : "";

  // 3. Build the mood override class
  const moodClass = mood ? `portal--mood-${mood}` : "";

  // 4. ⭐ NEW: Hover awareness — dramatic colour flash
  const hoverClass = document.body.classList.contains("portal-hovering")
    ? "portal--hover"
    : "";

  // 4a. Pulse speed logic
  const pulseClass =
    mood === "calm"
      ? "portal--pulse-slow"
      : mood === "reflective"
      ? "portal--pulse-medium"
      : "portal--pulse-fast";

  // 4b. Portal type (mood or seasonal)
  const typeClass = type ? `portal--${type}` : "";

  // 4c. Glow only for mood portal
  const glowClass = type === "mood" ? "portal--glow" : "";

  // 4d. Door aware and glow widens
  const awareClass = portalState === "aware" ? "portal--aware" : "";

  // 5. Combine all classes
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
    <div
      className={classes}
      onClick={() => {
        // If this is a mood portal, set the global mood
        if (type === "mood" && setMood) {
          setMood(mood);
        }

        // Preserve any additional click behaviour
        if (onClick) onClick();
      }}
    >
      <div className="portal__core">
        <div className="portal__crescent"></div>
        <div className="portal__shimmer"></div>
      </div>

      {cueText && <div className="portal__cue">{cueText}</div>}
    </div>
  );
}

export default Portal;

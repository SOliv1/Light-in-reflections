import { useRef } from "react";

export default function PhotoTile({
  photo,
  img = photo,          // fallback for older props
  onClick,
  isFavourite,
  onToggle,
  season,
  onDelete,
  onApproachPortal
}) {
  const tileRef = useRef(null);

  const seasonalGlow = {
    winter: "#7fc8ff",
    spring: "#ff8fb1",
    summer: "#ffd700",
    autumn: "#ffb36b",
  };

  const glow = seasonalGlow[season] || "#ffd700";

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!tileRef.current) return;

    tileRef.current.classList.add("photo-glow");

    setTimeout(() => {
      onDelete(photo.id);
    }, 180);
  };

  return (
    <div
      ref={tileRef}
      className="photo-tile"
      onClick={(e) => {
        // ⭐ FIRST HINGE — notify the Portal
        if (onApproachPortal) {
          onApproachPortal(photo);
        }

        // ⭐ Preserve existing click behaviour
        if (onClick) {
          onClick(e);
        }
      }}
    >
      <img
        src={img.src}
        alt={img.alt}
        className="photo-tile-image"
      />

      <button
        className="photo-tile-heart"
        style={{
          background: isFavourite ? glow : "rgba(0,0,0,0.35)",
          color: isFavourite ? "red" : "rgba(255,255,255,0.8)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {isFavourite ? "❤️" : "🤍"}
      </button>

      <button
        className="photo-delete-btn"
        onClick={handleDelete}
        aria-label="Move photo to basket"
        title="Move to basket"
      >
        🧺
      </button>
    </div>
  );
}

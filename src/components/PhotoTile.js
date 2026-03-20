

const PhotoTile = ({
  img,
  onClick,
  isFavourite,
  onToggle,
  season,
  photo,
  onDelete
}) => {
  const seasonalGlow = {
    winter: "#7fc8ff",
    spring: "#ff8fb1",
    summer: "#ffd700",
    autumn: "#ffb36b",
  };

  const glow = seasonalGlow[season] || "#ffd700";

  return (
    <div className="photo-tile" onClick={onClick}>
      <img src={img.src} alt={img.alt} />

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
        onClick={(e) => {
          e.stopPropagation();
          console.log("Deleting photo:", photo);
          onDelete(photo.id);   // or photo.src if you are still using src
        }}
        aria-label="Move photo to basket"
        title="Move to basket"
      >
      🧺
      </button>
    </div>
  );
};

export default PhotoTile;
import { useState } from "react";
import PhotoTile from "./PhotoTile";
import "./PhotoGallery.css";

const PhotoGallery = ({
  images,
  favourites,
  toggleFavourite,
  season,
  onDelete,
  onApproachPortal,
}) => {
  const [expandedPhoto, setExpandedPhoto] = useState(null);
  console.log("Gallery images:", images);

  const seasonalTint = {
  winter: "hue-rotate(180deg) brightness(1.05)",
  spring: "hue-rotate(320deg) brightness(1.08)",
  summer: "hue-rotate(40deg) brightness(1.1)",
  autumn: "hue-rotate(20deg) brightness(1.05)",
};

const seasonalBorderGlow = {
  winter: "rgba(127, 200, 255, 0.45)",
  spring: "rgba(255, 143, 177, 0.45)",
  summer: "rgba(255, 215, 0, 0.45)",
  autumn: "rgba(255, 179, 107, 0.45)",
};


  return (
    <>
      <div className="photo-grid">
        {images.map((image) => (
          <PhotoTile
            key={image.id}
            img={image}
            photo={image}
            isFavourite={!!favourites[image.id]}
            onToggle={() => toggleFavourite(image.id)}
            onClick={() => setExpandedPhoto(image.src)}
            season={season}
            onDelete={() => onDelete(image.id)}
            onApproachPortal={onApproachPortal}

          />
        ))}
      </div>

     {expandedPhoto && (
      <div className="photo-modal" onClick={() => setExpandedPhoto(null)}>
        <img
          src={expandedPhoto}
          alt="Expanded"
          className="seasonal-border"
          style={{ "--season-glow": seasonalBorderGlow[season] }}
        />
      </div>
     )}

    </>
  );
};

export default PhotoGallery;

import { useState } from "react";
import PhotoTile from "./PhotoTile";
import "./PhotoGallery.css";

const PhotoGallery = ({
  images,
  favourites,
  toggleFavourite,
  season,
  onDelete,
}) => {
  const [expandedPhoto, setExpandedPhoto] = useState(null);

  const seasonalTint = {
  winter: "hue-rotate(180deg) brightness(1.05)",
  spring: "hue-rotate(320deg) brightness(1.08)",
  summer: "hue-rotate(40deg) brightness(1.1)",
  autumn: "hue-rotate(20deg) brightness(1.05)",
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
            onDelete={() => onDelete(image.id)}   // ← gentle fix
          />
        ))}
      </div>

     {expandedPhoto && (
      <div className="photo-modal" onClick={() => setExpandedPhoto(null)}>
        <img
          src={expandedPhoto}
          alt="Expanded"
          style={{ filter: seasonalTint[season] || "none" }}
        />
      </div>
     )}

    </>
  );
};

export default PhotoGallery;

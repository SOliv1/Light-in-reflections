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
            onDelete={onDelete}
          />
        ))}
      </div>

      {expandedPhoto && (
        <div className="photo-modal" onClick={() => setExpandedPhoto(null)}>
          <img src={expandedPhoto} alt="Expanded" />
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
import { useState, useEffect } from "react";
import "./DayImageCarousel.css";

const DayImageCarousel = () => {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const response = await fetch("http://localhost:5000/days");
    const days = await response.json();

    // Collect all photos from all days
    const allPhotos = days.flatMap(day => day.photos || []);

    setImages(allPhotos);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="carousel">
      {images.map((src, i) => (
        <img key={i} src={src} alt="Day" />
      ))}
    </div>
  );
};

export default DayImageCarousel;

import { useState, useEffect } from "react";
import { fetchPhotosByWeather } from "../utils/fetchPhotosByWeather";

export default function useWeatherPhotos(weatherCondition) {
  const [photos, setPhotos] = useState([]);
  const [mood, setMood] = useState(null);

  useEffect(() => {
    if (!weatherCondition) return;

    async function load() {
      const data = await fetchPhotosByWeather(weatherCondition);
      setPhotos(data.photos);
      setMood(data.mood);
    }

    load();
  }, [weatherCondition]);

  return { photos, mood };
}
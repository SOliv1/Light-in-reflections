import { useState, useEffect } from "react";
import { getWeatherCondition } from "../utils/getWeatherCondition";
import { fetchFromApi } from "../api";

export default function useWeatherPhotos() {
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    async function fetchBackground() {
      try {
        if (!navigator.geolocation) {
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;
              const weather = await getWeatherCondition(lat, lon);
              const res = await fetchFromApi(
                `/api/background?weather=${encodeURIComponent(weather)}`
              );

              if (!res.ok) {
                console.warn(`Background request failed with status ${res.status}.`);
                return;
              }

              const data = await res.json();
              setBackgroundImage(data.imageUrl || null);
            } catch (err) {
              console.error("Weather background error:", err);
            }
          },
          (geoError) => {
            console.warn("Geolocation unavailable for weather background:", geoError);
          }
        );
      } catch (err) {
        console.error("Weather background error:", err);
      }
    }

    fetchBackground();
  }, []);

  return backgroundImage;
}

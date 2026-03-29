export async function fetchPhotosByWeather(lat, lon) {
  try {
    const res = await fetch(`http://localhost:5000/weather/photos?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching weather photos:", err);
    return { photos: [], fallback: true };
  }
}

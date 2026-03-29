export async function getWeatherCondition(lat, lon) {
  const apiKey = import.meta.env.WEATHER_API_KEY;

  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  // Safety checks
  if (!data || !data.weather || !Array.isArray(data.weather) || !data.weather[0]) {
    console.warn("Weather API returned unexpected data:", data);
    return "unknown";
  }

  return data.weather[0].main;
}

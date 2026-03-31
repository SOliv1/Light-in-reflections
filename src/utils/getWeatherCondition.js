export async function getWeatherCondition(lat, lon) {
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  if (!apiKey) {
    console.warn("Missing REACT_APP_WEATHER_API_KEY; skipping weather lookup.");
    return "unknown";
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const res = await fetch(url);

  if (!res.ok) {
    console.warn(`Weather API request failed with status ${res.status}.`);
    return "unknown";
  }

  const data = await res.json();

  if (!data || !data.weather || !Array.isArray(data.weather) || !data.weather[0]) {
    console.warn("Weather API returned unexpected data:", data);
    return "unknown";
  }

  return data.weather[0].main;
}

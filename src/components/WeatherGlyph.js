import React, { useState } from "react";
import "./WeatherGlyph.css";

const WeatherGlyph = ({ condition, isNight }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="weather-glyph-wrapper">
  <div
    className={`weather-glyph ${condition} ${isNight ? "night" : "day"} ${
      expanded ? "expanded" : ""
    }`}
    onClick={() => setExpanded(!expanded)}
  >
    <div className="breathing-wrapper">
      <div className="weather-core"></div>
      <div className="rain-layer"></div>
      <div className="snow-layer"></div>
      <div className="sparkle-layer"></div>
    </div>
  </div>
</div>

);

};

export default WeatherGlyph;

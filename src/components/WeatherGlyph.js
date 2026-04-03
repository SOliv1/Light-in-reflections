import React from "react";
import "./WeatherGlyph.css";

const WeatherGlyph = ({ condition, isNight }) => {
  return (
    <div className="weather-glyph-wrapper">
      <div className={`weather-glyph ${condition} ${isNight ? "night" : "day"}`}>
        <div className="weather-core"></div>

        {/* Rain */}
        <div className="rain-layer"></div>

        {/* Snow */}
        <div className="snow-layer"></div>

        {/* Sparkles */}
        <div className="sparkle-layer"></div>
      </div>
    </div>
  );
};

export default WeatherGlyph;

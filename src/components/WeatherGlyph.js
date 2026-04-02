
import React from "react";
import "./WeatherGlyph.css";

export default function WeatherGlyph({ condition }) {
  return (
    <div className={`weather-orb ${condition}`}></div>
  );
}
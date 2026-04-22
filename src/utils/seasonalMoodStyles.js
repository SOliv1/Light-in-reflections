export const seasonalBorderGlow = {
  winter: "rgba(127, 200, 255, 0.45)",
  spring: "rgba(255, 143, 177, 0.45)",
  summer: "rgba(255, 215, 0, 0.45)",
  autumn: "rgba(255, 179, 107, 0.45)",
};

export const moodImageFilter = {
  // Personal mood themes (portal / birthday experience)
  "warm-spotlight": "sepia(0.38) saturate(1.24) brightness(1.1) contrast(1.04) hue-rotate(-10deg)",
  "blue-hour": "brightness(0.9) saturate(0.78) contrast(1.08) hue-rotate(-22deg)",
  "dress-rehearsal": "brightness(1.05) saturate(0.9) contrast(0.98) hue-rotate(8deg)",
  "golden-encore": "none",
  "velvet-midnight": "brightness(0.76) saturate(0.68) contrast(1.18) hue-rotate(-34deg)",
  calm: "brightness(1.04) saturate(0.94)",
  joyful: "sepia(0.32) saturate(1.18) brightness(1.08) hue-rotate(-6deg)",
  stormy: "brightness(0.82) saturate(0.7) contrast(1.16) hue-rotate(-32deg)",
  reflective: "brightness(0.92) saturate(0.82) hue-rotate(-12deg)",
  natural: "none",
  // Weather mood dimming filters — applied to bg-image/weather-image when veil is ON
  // These compensate for bright mood variants so images stay well-toned.
  sunny:   "brightness(0.84) saturate(1.04)",
  cloudy:  "brightness(0.90) saturate(0.97) contrast(0.98)",
  rain:    "brightness(0.87) saturate(1.0)",
  storm:   "brightness(0.80) saturate(0.88) contrast(1.06)",
  mist:    "brightness(0.86) saturate(0.90)",
  snow:    "brightness(0.83) saturate(0.92)",
  neutral: "brightness(0.88)",
  unknown: "brightness(0.88)",
};

export const moodImageOverlay = {
  "warm-spotlight": "linear-gradient(180deg, rgba(255, 210, 156, 0.14), rgba(145, 76, 34, 0.16))",
  "blue-hour": "linear-gradient(180deg, rgba(120, 158, 255, 0.14), rgba(22, 36, 92, 0.2))",
  "dress-rehearsal": "linear-gradient(180deg, rgba(225, 198, 255, 0.12), rgba(78, 50, 104, 0.16))",
  "golden-encore": "linear-gradient(180deg, rgba(255, 235, 188, 0.06), rgba(114, 78, 28, 0.08))",
  "velvet-midnight": "linear-gradient(180deg, rgba(108, 118, 196, 0.12), rgba(12, 16, 44, 0.24))",
  calm: "linear-gradient(180deg, rgba(225, 198, 255, 0.12), rgba(78, 50, 104, 0.16))",
  joyful: "linear-gradient(180deg, rgba(255, 210, 156, 0.14), rgba(145, 76, 34, 0.16))",
  stormy: "linear-gradient(180deg, rgba(108, 118, 196, 0.12), rgba(12, 16, 44, 0.24))",
  reflective: "linear-gradient(180deg, rgba(120, 158, 255, 0.14), rgba(22, 36, 92, 0.2))",
  natural: "linear-gradient(180deg, rgba(255, 235, 188, 0.06), rgba(114, 78, 28, 0.08))",
};

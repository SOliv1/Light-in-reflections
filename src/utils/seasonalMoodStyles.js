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

export const seasonalPriorityPalette = {
  winter: {
    highest: {
      background: "linear-gradient(135deg, rgba(160, 219, 255, 0.34), rgba(95, 146, 232, 0.18))",
      border: "rgba(182, 229, 255, 0.72)",
      badge: "rgba(182, 229, 255, 0.28)",
      text: "rgba(232, 247, 255, 0.98)",
    },
    high: {
      background: "linear-gradient(135deg, rgba(133, 195, 255, 0.26), rgba(84, 129, 216, 0.14))",
      border: "rgba(150, 203, 255, 0.58)",
      badge: "rgba(150, 203, 255, 0.2)",
      text: "rgba(228, 243, 255, 0.96)",
    },
    medium: {
      background: "linear-gradient(135deg, rgba(118, 160, 219, 0.18), rgba(74, 107, 180, 0.11))",
      border: "rgba(133, 175, 231, 0.44)",
      badge: "rgba(133, 175, 231, 0.16)",
      text: "rgba(223, 234, 247, 0.94)",
    },
    low: {
      background: "linear-gradient(135deg, rgba(157, 180, 204, 0.12), rgba(96, 117, 150, 0.08))",
      border: "rgba(176, 196, 219, 0.32)",
      badge: "rgba(176, 196, 219, 0.12)",
      text: "rgba(214, 225, 238, 0.9)",
    },
  },
  spring: {
    highest: {
      background: "linear-gradient(135deg, rgba(255, 182, 206, 0.34), rgba(244, 124, 166, 0.18))",
      border: "rgba(255, 201, 219, 0.72)",
      badge: "rgba(255, 201, 219, 0.28)",
      text: "rgba(255, 243, 247, 0.98)",
    },
    high: {
      background: "linear-gradient(135deg, rgba(255, 194, 214, 0.26), rgba(235, 140, 173, 0.14))",
      border: "rgba(255, 203, 221, 0.58)",
      badge: "rgba(255, 203, 221, 0.2)",
      text: "rgba(255, 239, 244, 0.96)",
    },
    medium: {
      background: "linear-gradient(135deg, rgba(236, 193, 205, 0.18), rgba(208, 155, 176, 0.11))",
      border: "rgba(241, 204, 215, 0.44)",
      badge: "rgba(241, 204, 215, 0.16)",
      text: "rgba(252, 235, 240, 0.94)",
    },
    low: {
      background: "linear-gradient(135deg, rgba(228, 213, 219, 0.12), rgba(188, 160, 172, 0.08))",
      border: "rgba(236, 220, 227, 0.32)",
      badge: "rgba(236, 220, 227, 0.12)",
      text: "rgba(248, 235, 239, 0.9)",
    },
  },
  summer: {
    highest: {
      background: "linear-gradient(135deg, rgba(255, 226, 140, 0.34), rgba(255, 185, 73, 0.18))",
      border: "rgba(255, 231, 166, 0.72)",
      badge: "rgba(255, 231, 166, 0.28)",
      text: "rgba(255, 248, 229, 0.98)",
    },
    high: {
      background: "linear-gradient(135deg, rgba(255, 221, 158, 0.26), rgba(255, 189, 102, 0.14))",
      border: "rgba(255, 225, 168, 0.58)",
      badge: "rgba(255, 225, 168, 0.2)",
      text: "rgba(255, 245, 220, 0.96)",
    },
    medium: {
      background: "linear-gradient(135deg, rgba(242, 207, 153, 0.18), rgba(224, 168, 82, 0.11))",
      border: "rgba(246, 215, 161, 0.44)",
      badge: "rgba(246, 215, 161, 0.16)",
      text: "rgba(252, 240, 213, 0.94)",
    },
    low: {
      background: "linear-gradient(135deg, rgba(228, 211, 180, 0.12), rgba(191, 164, 114, 0.08))",
      border: "rgba(235, 220, 191, 0.32)",
      badge: "rgba(235, 220, 191, 0.12)",
      text: "rgba(247, 238, 220, 0.9)",
    },
  },
  autumn: {
    highest: {
      background: "linear-gradient(135deg, rgba(255, 191, 138, 0.34), rgba(225, 120, 62, 0.18))",
      border: "rgba(255, 206, 165, 0.72)",
      badge: "rgba(255, 206, 165, 0.28)",
      text: "rgba(255, 244, 236, 0.98)",
    },
    high: {
      background: "linear-gradient(135deg, rgba(246, 183, 132, 0.26), rgba(215, 129, 77, 0.14))",
      border: "rgba(250, 199, 157, 0.58)",
      badge: "rgba(250, 199, 157, 0.2)",
      text: "rgba(255, 239, 227, 0.96)",
    },
    medium: {
      background: "linear-gradient(135deg, rgba(225, 176, 140, 0.18), rgba(180, 111, 74, 0.11))",
      border: "rgba(234, 191, 156, 0.44)",
      badge: "rgba(234, 191, 156, 0.16)",
      text: "rgba(250, 233, 221, 0.94)",
    },
    low: {
      background: "linear-gradient(135deg, rgba(208, 184, 166, 0.12), rgba(148, 118, 96, 0.08))",
      border: "rgba(221, 202, 187, 0.32)",
      badge: "rgba(221, 202, 187, 0.12)",
      text: "rgba(243, 231, 224, 0.9)",
    },
  },
};

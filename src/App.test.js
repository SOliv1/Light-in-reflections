jest.mock(
  "react-router-dom",
  () => ({
    BrowserRouter: ({ children }) => <>{children}</>,
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
    Route: () => null,
    Routes: ({ children }) => <>{children}</>,
    useLocation: () => ({ pathname: "/" }),
  }),
  { virtual: true }
);

jest.mock("./api", () => ({
  fetchFromApi: jest.fn((path) => {
    if (path.includes("/api/gallery")) {
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({
        main: { temp: 15 },
        name: "Test City",
        sys: { country: "GB" },
        weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
      }),
    });
  }),
}));

jest.mock("./hooks/useWeatherPhotos", () => jest.fn(() => null));
jest.mock("./components/BackgroundCarousel", () => () => <div>Background Carousel</div>);
jest.mock("./components/Calendar", () => () => <div>Calendar</div>);
jest.mock("./components/Constellation", () => () => <div>Constellation</div>);
jest.mock("./components/portal/Portal", () => () => <div>Portal</div>);
jest.mock("./components/WeatherGlyphPanel", () => () => <div>Weather Glyph</div>);
jest.mock("./pages/DayPage", () => () => <div>Day Page</div>);
jest.mock("./dev-only/MockWeatherGlyph", () => () => <div>Mock Weather Glyph</div>);
jest.mock("./components/DailyQuote", () => () => <div>Daily Quote</div>);
jest.mock("./components/UnifiedDrawer", () => () => <div>Unified Drawer</div>);

import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { fetchFromApi } from "./api";

beforeEach(() => {
  fetchFromApi.mockImplementation((path) => {
    if (path && path.includes("/api/gallery")) {
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({
        main: { temp: 15 },
        name: "Test City",
        sys: { country: "GB" },
        weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
      }),
    });
  });

  Object.defineProperty(global.navigator, "geolocation", {
    configurable: true,
    value: {
      getCurrentPosition: jest.fn((success) =>
        success({
          coords: {
            latitude: 51.5072,
            longitude: 0.1276,
          },
        })
      ),
    },
  });

  window.requestAnimationFrame = (callback) => callback();
});

test("renders inspiration buttons", async () => {
  render(<App />);

  await waitFor(() => expect(fetchFromApi).toHaveBeenCalled());
  expect(screen.getByRole("button", { name: /reflections/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /quote of the day/i })).toBeInTheDocument();
});

import { useState } from "react";
import {
  Search,
  Droplets,
  Wind,
  Sunrise,
  Sunset,
  MapPin,
} from "lucide-react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError("City not found. Please enter a valid city.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="app">
      <div className="weather-container">

        <h1>🌤️ Weather Dashboard</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getWeather();
              }
            }}
          />

          <button onClick={getWeather}>
            <Search size={20} />
            Search
          </button>
        </div>

        {loading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading weather...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error">
            ⚠️ {error}
          </div>
        )}

        {weather && !loading && (
          <div className="weather-card">

            <div className="location">
              <MapPin size={22} />
              <h2>
                {weather.name}, {weather.sys.country}
              </h2>
            </div>

            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />

            <h3 className="temperature">
              {Math.round(weather.main.temp)}°C
            </h3>

            <p className="description">
              {weather.weather[0].description}
            </p>

            <div className="weather-info">

              <div className="info-box">
                <Droplets size={28} />
                <span>Humidity</span>
                <strong>{weather.main.humidity}%</strong>
              </div>

              <div className="info-box">
                <Wind size={28} />
                <span>Wind Speed</span>
                <strong>{weather.wind.speed} m/s</strong>
              </div>

              <div className="info-box">
                <Sunrise size={28} />
                <span>Sunrise</span>
                <strong>{formatTime(weather.sys.sunrise)}</strong>
              </div>

              <div className="info-box">
                <Sunset size={28} />
                <span>Sunset</span>
                <strong>{formatTime(weather.sys.sunset)}</strong>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
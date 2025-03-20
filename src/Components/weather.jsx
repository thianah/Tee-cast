import React, { useState, useEffect, useRef } from "react";
import cloudy from "../assets/cloudy.png";
import rain from "../assets/rainy-day.png";
import sunny from "../assets/sun.png";
import humidity from "../assets/humi.png";
import weather from "../assets/weather.png";
import { CiSearch } from "react-icons/ci";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');

  const allIcons = {
    "01d": sunny, "02d": cloudy, "03d": cloudy, "04d": cloudy,
    "09d": rain, "10d": rain, "11d": rain, "13d": rain, "50d": cloudy,
    "01n": sunny, "02n": cloudy,
  };

  // Function to fetch weather data
  const search = async (city) => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        alert("City not found");
        return;
      }
      const data = await res.json();

      const icon = allIcons[data.weather?.[0]?.icon] || cloudy;
      setWeatherData({
        name: data.name,
        main: data.weather?.[0]?.main,
        humidity: data.main?.humidity,
        temp: Math.floor(data.main?.temp),
        wind: data.wind?.speed,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(null);
      console.error(error);
    }
  };

  useEffect(() => {
    search("Akure");
  }, []);

  // Fetch location suggestions using OpenWeather Geocoding API
  const getSuggestions = async (input) => {
    if (!input) return [];

    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=2&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      return data.map((location) => ({
        name: `${location.name}, ${location.country}`,
        lat: location.lat,
        lon: location.lon,
      }));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);

    if (inputValue) {
      const results = await getSuggestions(inputValue);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion.name);
    setSuggestions([]);
    search(suggestion.name.split(",")[0]); // Extract city name only
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search(value.split(",")[0]); // Extract city name only
    }
  };

  const onSearch = () => {
    search(value.split(",")[0]); // Extract city name only
  }

 
  return (
    <section className="weather-container">
      <div className="search-bar relative">
        <input
          type="text"
          placeholder="Search City"
          value={value}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
          className="custom-input pr-10" // Add padding-right to avoid overlap with the icon
        />
        <CiSearch
          className="search-icon absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={onSearch}
        />
        {suggestions.length > 0 && (
          <div className="custom-suggestions-container">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="custom-suggestion"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="weather">
        {weatherData ? (
          <>
            <img src={weatherData.icon} alt="weather icon" className="clouds" />
            <p>Temperature: {weatherData.temp}°C</p>
            <p>Location: {weatherData.name}</p>
            <div>
              <p>
                Humidity: {weatherData.humidity}%
                <img src={humidity} alt="humidity icon" className="icon" />
              </p>
              <p>
                Wind Speed: {weatherData.wind} m/s
                <img src={cloudy} alt="wind icon" className="icon" />
              </p>
            </div>
          </>
        ) : (
          <p>No weather data available</p>
        )}
      </div>
    </section>
  );
};

export default Weather;

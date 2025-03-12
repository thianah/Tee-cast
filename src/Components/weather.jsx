import React, { useState, useEffect, useRef } from "react";

import cloudy from "../assets/cloudy.png";
import rain from "../assets/rainy-day.png";
import sunny from "../assets/sun.png";
import humidity from "../assets/humi.png";
import weather from "../assets/weather.png";
import { GoSearch } from "react-icons/go"

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const allIcons = {
    "01d": sunny,
    "02d": cloudy,
    "03d": cloudy,
    "04d": cloudy,
    "09d": rain,
    "10d": rain,
    "11d": rain,
    "13d": rain,
    "50d": cloudy,
    "01n": sunny,
    "02n": cloudy,
  };

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
    search("akure");
  }, []);

  return (
    <section className="weather-container">
      <div className="search-bar">
        <input
          className="search-input"
          ref={inputRef}
          type="text"
          placeholder="Search City"
        />
        <GoSearch 
        onClick={() => search(inputRef.current.value)}/>
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

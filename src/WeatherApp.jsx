import React, { useState } from 'react';
import { Country, City } from 'country-state-city';
import axios from 'axios';

const WeatherApp = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const countries = Country.getAllCountries();
  const cities = selectedCountry 
    ? City.getCitiesOfCountry(selectedCountry.isoCode)
    : [];

  const handleCountryChange = (e) => {
    const country = countries.find(c => c.isoCode === e.target.value);
    setSelectedCountry(country);
    setSelectedCity('');
  };

  const handleCityChange = (e) => {
    const city = cities.find(c => c.name === e.target.value);
    setSelectedCity(city);
  };

  const fetchWeather = async () => {
    if (!selectedCity) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
      );
      setWeatherData(response.data.current);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
    setLoading(false);
  };

  return (
    <div className={`weather-app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <h1>WeatherNow</h1>
      
      <div className="selectors">
        <select onChange={handleCountryChange} value={selectedCountry?.isoCode || ''}>
          <option value="">Select Country</option>
          {countries.map(country => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>

        <select 
          onChange={handleCityChange} 
          value={selectedCity?.name || ''}
          disabled={!selectedCountry}
        >
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
          <br></br>
        <button 
          onClick={fetchWeather}
          disabled={!selectedCity || loading}
        >
          Enter
        </button>
      </div>

      <button 
        onClick={() => setIsDarkMode(!isDarkMode)} 
        className="theme-toggle"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {loading && <p>Loading...</p>}
      
      {weatherData && (
        <div className="weather-info">
          <h2>Weather in {selectedCity.name}</h2>
          <p>Temperature: {weatherData.temperature_2m}°C</p>
          <p>Humidity: {weatherData.relative_humidity_2m}%</p>
          <p>Wind Speed: {weatherData.wind_speed_10m} km/h</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
import WeatherService from "../services/weather";
import { useEffect, useState } from "react";

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    WeatherService.getWeather(country.latlng[0], country.latlng[1]).then(
      (data) => {
        setWeather(data);
      },
    );
  }, [country]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>{country.capital[0]}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      {weather && (
        <div>
          <h2>Weather in {country.capital[0]}</h2>
          <div>
            Temperature: {(weather.main.temp - 273.15).toFixed(2)} Celsius
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
          <div>Wind {weather.wind.speed.toFixed(1)} m/s</div>
        </div>
      )}
    </div>
  );
};

export default Country;

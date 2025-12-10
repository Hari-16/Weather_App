import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import humidity_icon from '../assets/humidity.png'
import wind_icon from '../assets/wind.png'
import { TailSpin } from 'react-loader-spinner'   

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)  
  const inputRef = useRef()

  const search = async (city) => {
    if (!city) {
      alert("Please enter a city name")
      return
    }

    try {
      setLoading(true)  
      setWeatherData(null) 

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
      console.log("Fetching:", url)  
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        alert(data.message)
        setWeatherData(null)
        setLoading(false)
        return
      }

      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: iconUrl,
      })
    } catch (error) {
      console.error("Error fetching weather:", error)
      setWeatherData(null)
    } finally {
      setLoading(false)  
    }
  }

  useEffect(() => {
    search("Delhi")
  }, [])

  return (
    <div className="weather">
      <div className="search-bar">
        <input type="text" placeholder="Enter city name" ref={inputRef} />
        <img
          src={search_icon}
          alt="search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

     
      {loading && (
        <div className="loader">
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="loading"
          />
        </div>
      )}

   
      {!loading && weatherData && (
        <>
          <img src={weatherData.icon} alt="weather icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Weather

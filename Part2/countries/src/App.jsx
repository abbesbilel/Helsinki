import { useState, useEffect } from 'react'
import axios from "axios";
import countriesServices from './services/countries'

const CountryDetail = ({ country }) => {
  const languages = Object.values(country.languages || {})
  const api_key = import.meta.env.VITE_SOME_KEY
  const [weather, setWeather] = useState(null)
  const capital = country.capital ? country.capital[0] : null

  useEffect(() => {
    if (!capital) return

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Error fetching weather:', error)
      })
  }, [capital, api_key])
  console.log(weather)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h1>Languages</h1>
      <ul>
        {languages.map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} />
      {weather && (
        <div>
          <h2>Weather in {capital}</h2>
          <p>temperature {weather.main.temp} Celsius</p>
          
          {weather.weather[0] && (
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description} 
            />
          )}

          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}

    </div>
  )
}

const Display = ({ countriesToShow, selectedCountry, onShowCountry }) => {
  if (selectedCountry) {
    return <CountryDetail country={selectedCountry} />
  } else
    if (countriesToShow.length === 1) {
      return <CountryDetail country={countriesToShow[0]} />
    }
    else if (countriesToShow.length <= 10) {
      return (
        <ul>
          {countriesToShow.map(country => (
            <li key={country.name.common}>
              {country.name.common}
              <button onClick={() => onShowCountry(country)}>Show</button>
            </li>
          ))}
        </ul>
      )
    }
    else if (countriesToShow.length > 10) {
      return <p>too many matches, specify another filter</p>
    }
}

const App = () => {

  const [newCountry, setNewCountry] = useState("")
  const [countries, setCountries] = useState([])
  const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all"
  const [selectedCountry, setSelectedCountry] = useState(null)

  const handleChange = (event) => {
    setNewCountry(event.target.value)
    setSelectedCountry(null)
  }

  useEffect(() => {
    countriesServices.getAll().then(response => {
      setCountries(response)
    })
  }, [])

  const countriesToShow = countries.filter(c =>
    c.name.common.toLowerCase().includes(newCountry.toLowerCase())
  )



  return (
    <div>
      <form>
        <p>find countries</p>
        <input value={newCountry} onChange={handleChange} />
      </form>
      <Display
        countriesToShow={countriesToShow}
        selectedCountry={selectedCountry}
        onShowCountry={setSelectedCountry}
      />
    </div>
  )
}
export default App
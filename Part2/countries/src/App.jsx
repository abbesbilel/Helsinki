import { useState, useEffect } from 'react'
import axios from "axios";
import countriesServices from './services/countries'

const CountryDetail = ({country}) => {
  const languages = Object.values(country.languages || {})
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
      <img src={country.flags.png}/>
    </div>
  )
}

const Display = ({ countriesToShow }) => {
  if (countriesToShow.length === 1) {
    return <CountryDetail country={countriesToShow[0]} />
  }
  else if (countriesToShow.length <= 10) {
    return (
      <ul>
        {countriesToShow.map(country => (
          <li key={country.name.common}>{country.name.common}</li>
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

  const handleChange = (event) => {
    setNewCountry(event.target.value)
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
      {/* <ul>
        {countriesToShow.map(country => (
          <li key={country.name.common}>{country.name.common}</li>
        ))}
      </ul> */}
      <Display countriesToShow={countriesToShow} />
    </div>
  )
}
export default App
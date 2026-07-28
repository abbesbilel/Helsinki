import { useState, useEffect } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook'


const Notification = ({ message, state }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={state}>{message}</div>
  )
}


const PersonLine = ({ person, removePerson }) => (
  <li>{person.name} {person.number}
    <button onClick={removePerson}>delete</button>
  </li>
)

const People = ({ persons, removePerson }) => (
  <ul>
    {persons.map(person => (
      <PersonLine key={person.name} person={person} removePerson={() => removePerson(person.id)} />
    ))}
  </ul>
)

const Form = ({ newName, newNumber, handleChange, handleNumberChange, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleChange} />
    </div>
    <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const App = () => {
  const [persons, setPersons] = useState([])

  const removePerson = id => {
    const personToRemove = `http://localhost:3001/persons/${id}`
    if (window.confirm("Are you sure you want to delete this person?")) {
      phonebookService.remove(personToRemove).then(response => {
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  useEffect(() => {
    phonebookService.getAll()
      .then(response =>
        setPersons(response)
      )
  }, [])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [state, setState] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.trim().toLowerCase()
    )
    if (existingPerson) {
      if (window.confirm("this person already exists, do you want to change the number")) {
        const personObject = { ...existingPerson, number: newNumber }
        console.log(personObject)
        phonebookService.update(personObject.id, personObject)
          .then(response => {
            setPersons(persons.map(person => person.id === personObject.id ? personObject : person))
            setState('success')
            setMessage(`${newName} number was changed successfuly`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessage(`${newName} was already deleted`)
            setState('error')
            setTimeout(() => {
              setMessage(null)
              setState(null)
            }, 5000)
          })
      }
      return
    }
    const personObject = { name: newName, number: newNumber }
    phonebookService.create(personObject)
      .then((response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
        setMessage(`${newName} was added successfuly`)
        setState('success')
        setTimeout(() => {
          setMessage(null)
          setState(null)
        }, 5000)
      }))
  }

  const handleChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} state={state} />
      <div>
        filter shown with <input value={newSearch} onChange={handleSearchChange} />
      </div>
      <ul>
        {personsToShow.map(person => (
          <PersonLine key={person.name} person={person} />
        ))}
      </ul>
      <h2>Add a new</h2>
      <Form newName={newName} newNumber={newNumber} handleChange={handleChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <People persons={persons} removePerson={removePerson} />

    </div>
  )
}

export default App
import { useState } from 'react'

  const PersonLine = ({ person }) => (
    <li>{person.name} {person.number}</li>
  )

  const People = ({ persons }) => (
    <ul>
      {persons.map(person => (
        <PersonLine key={person.name} person={person} />
      ))}
    </ul>
  )

  const Form = ({newName, newNumber, handleChange, handleNumberChange, addPerson}) => (
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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some(person => person.name === newName);
    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = { name: newName, number: newNumber }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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
    <People persons={persons} />

  </div>
)
}

export default App
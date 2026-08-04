const express = require("express")
const morgan = require("morgan")
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('dist'))

app.use(express.json())

morgan.token('body', (request, response) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
    return ''
})

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()
    response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
        `)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing"
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})
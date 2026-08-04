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

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const count = Person.countDocuments({})
    const date = new Date()
    response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
        `)
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    })
        .catch(error => next(error))
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

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    Person.findById(request.params.id)
        .then(person => {
            if (!body.name || !body.number) {
                return response.status(404).end()
            }

            person.name = body.name
            person.number = body.number
            return person.save().then((updatedPerson) => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})
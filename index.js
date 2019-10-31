require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

const logger = morgan((tokens, req, res) => {
  const body = req.body
  const log = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]

  if (!body.name && !body.number) {
    return log.join(' ')
  }

  const personObject = JSON.stringify({ name: body.name, number: body.number })

  return log.concat(personObject).join(' ')
})

app.use(logger)

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/info', (request, response) => {
  Person.find({})
    .then(persons => {
      response
        .send(`
      <p>Phonebook has info for ${persons.length} people</p> 
      <p>${new Date()}</p>
    `)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person.toJSON())
    })
    .catch(error => {
      response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'Name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(p => {
      response.json(p.toJSON())
    })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123654",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response
    .send(`
      <p>Phonebook has info for ${persons.length} people</p> 
      <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.random() * 9999
}

const doesNameExist = (name) => {
  return persons.find(p => p.name === name)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'Name or number missing'
    })
  } else if (doesNameExist(body.name)) {
    return response.status(400).json({
      error: 'Name is already added to phonebook'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  console.log(persons)
  persons = persons.concat(person)
  console.log(persons)
  response.json(person)
})

const port = 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
require('dotenv').config()
const express = require('express')
const app = express()
const PhonebookEntry = require('./models/phoneData')
const cors = require('cors')
const morgan = require('morgan')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('dist'))

morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time - :total-time[digits] ms :body'))

app.use(errorHandler)

app.get('/', (request, response) => {

  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', async (request, response) => {
  
  await PhonebookEntry.find({}).then((data) => {
    console.log(data)
    if (!data) {
      return response.json([])
    }
    return response.json(data)
  })
})

app.get('/info', async (request, response) => {
  await PhonebookEntry.find({}).then((persons) => {
    const markup = (`<p>Phonebook has info for ${persons.length} people</p><p>${new Date(Date.now())}`)
    response.send(markup)
  })
})

app.get('/api/persons/:id', async (request, response) => {
  const { id } = request.params

  if (!id) {
    return response.status(404).end()
  }

  await PhonebookEntry.find({ id }, { _id: 0, __v: 0 })
    .then(person => {
      if (person) {
        response.json(person[0])
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

app.put('/api/persons/:id', async (request, response) => {

  const { id } = request.params

  const newName = request.body.name.trim()

  const newNumber = { name: newName, number: request.body.number, id: id || Math.floor(Math.random() * 10000 + 1) }

  const personExists = await PhonebookEntry.findOne({ id: id })

  if (!personExists) {
    return response.status(404).json({ error: 'Sorry, username does not exist.' })
  }

  await PhonebookEntry.updateOne({ id: personExists.id }, { ...newNumber }).then((person) => {
    if (person) {

      return response.json({ name: newName })
    }
  }).catch((error) => {
    console.log(error.response.data.error)
  })

})


app.post('/api/persons', async (request, response) => {

  const newName = request.body.name.trim()

  const newNumber = { name: newName, number: request.body.number, id: request.body.id || Math.floor(Math.random() * 10000 + 1)  }

  const newPhoneNumber = request.body.number

  if (!newPhoneNumber) {

    return response.status(404).json({ error: 'Sorry, this is an invalid number' })
  }

  await PhonebookEntry.findOne({ number: request.body.number }).then((person) => {

    let opts = { runValidators: true }

    console.log('person', person)

    if (!person) {

      return PhonebookEntry({ ...newNumber }).save().then(() => {

        response.status(201).json({ message: `${newNumber.name} added`, name: newNumber.name })

      }).catch((error) => {
        response.status(500).json(error)
      })

    }


    return PhonebookEntry.updateOne({ number: request.body.number }, { ...newNumber }, opts).then((person) => {

      console.log(person)

    }).catch((error) => {
      
      response.status(500).json(error)
    })

  })

})

app.delete('/api/persons/:id', async (request, response) => {

  const id = request.params.id

  if (!id) {
    return response.status(404).json({ error: 'Invalid number' })
  }

  await PhonebookEntry.find({ id }).then((person) => {

    if (!person) {
      return response.status(404).json({ error: 'Could not find number, are you sure it exists?' })
    }
    PhonebookEntry.deleteOne({ id }).then(() => {
      return response.json({ message: `${person.name} deleted` })
    })
  }).catch(() => {
    response.status(404).json({ error: 'Something went wrong.' })
  })
})

app.delete('/api/persons', async (request, response) => {
  await PhonebookEntry.deleteMany({}).then(() => {
    response.status(204).json({ message: 'All numbers deleted.' })
  })

})

app.use(unknownEndpoint)

module.exports = app
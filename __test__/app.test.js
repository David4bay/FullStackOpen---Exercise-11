const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
mongoose.set('bufferTimeoutMS', 1000000)

const api = supertest(app)

describe('Homepage works and title is displayed', () => {

    test('Homepage works', async () => {
        await api.get('/').expect(200)
    })

    test('Should have `Phonebook App` as title', async () => {

        const response = await api.get('/')
        
        expect(response.text).toContain('<title>Phonebook App</title>')
    })
})

describe('Phonebook API', () => {
  
    test('GET /api/persons should return 200 and a list of persons', async () => {
      const response = await api.get('/api/persons')
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
    }, 400000)
  
    test('POST /api/persons should add a new person', async () => {
      const newPerson = { name: 'John Doe', number: '123-456-7890' }
      const response = await api.post('/api/persons').send(newPerson)
      expect(response.status).toBe(201)
      expect(response.body.message).toBe(`${newPerson.name} added`)
    }, 400000)
  
    test('PUT /api/persons/:id should update a person', async () => {
      const newPerson = { name: 'Jane Doe', number: '987-654-3210' }
      const createdPerson = await api.post('/api/persons').send(newPerson)
      const response = await api.put(`/api/persons/${createdPerson.body.id}`).send({ name: 'Jane Smith' })
      expect(response.status).toBe(200)
      expect(response.body.name).toBe('Jane Smith')
    }, 400000)
  
    test('DELETE /api/persons/:id should delete a person', async () => {
      const newPerson = { name: 'John Smith', number: '123-123-1237'}
      const createdPerson = await api.post('/api/persons').send(newPerson)
      const response = await api.delete(`/api/persons/${createdPerson.body.id}`)
      expect(response.status).toBe(204)
    }, 400000)
  
    test('Unknown endpoint should return 404', async () => {
      const response = await api.get('/unknown')
      expect(response.status).toBe(404)
      expect(response.body.error).toBe('unknown endpoint')
    }, 400000)
  })

afterAll(async () => {
    await api.delete('/api/persons').expect(204)
    await mongoose.connection.close()
}, 1000000)
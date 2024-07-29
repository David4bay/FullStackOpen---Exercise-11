require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.NODE_ENV !== 'test' ? `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASS)}@cluster0.7fmaegp.mongodb.net/phonebook?retryWrites=true&w=majority` : `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASS)}@cluster0.7fmaegp.mongodb.net/phonebookTest?retryWrites=true&w=majority`

mongoose.connect(url).then(() => {
  console.log(`Successfully connected to ${url}`)
}).catch((e) => {
  console.log(`Failed to connect, returned ${e?.message}`)
})

const phoneNumberSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  id: String,
})

module.exports = mongoose.model('PhonebookEntry', phoneNumberSchema)
const mongoose = require('mongoose')

const persons = [
  {
    'id': 1,
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': 2,
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': 3,
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': 4,
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 4) {
  console.log('terminal command not complete')
  process.exit(1)
}

if (/\d+/.test(process.argv[3])) {
  console.log('name is number, not allowed')
  process.exit(1)
}

// if (/a-zA-Z+/.test(process.argv[4])) {
//   console.log('number is name, not allowed')
//   process.exit(1)
//   console.log('hello')
// }

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://Davidbay:${password}@cluster0.7fmaegp.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookEntrySchema = new mongoose.Schema({
  name: String,
  number: String
})

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema)

const entries = PhonebookEntry.find({}).then((data) => {
  console.log('data', data)
  // if no phonenumbers we want to save them to the database
  if (!data) {
    for (const entry of data) {
      new PhonebookEntry({
        name: entry.name,
        number: entry.number
      }).save().then((user) => {
        console.log(`${user} saved to database`)
      })
    }
  }
})

if (process.argv.length === 3) {
  // if the length of your terminal command is 3 we check for the list of numbers
  PhonebookEntry.find({}, { name: 1, number: 1 }).then((phoneDetail) => {
    let result = 'phonebook:'
    for (const details of phoneDetail) {
      result += `\n${details.name} ${details.number}`
    }
    console.log(result)
  })
}

if (process.argv.length === 5) {

  const entry = PhonebookEntry.findOne({
    name: `${process.argv[3]}`,
    number: `${process.argv[4]}` }, { name: 1, number: 1 }).then((data) => {
    if (data) {
      console.log('data', data)
    } else {
      new PhonebookEntry({
        name: `${process.argv[3]}`,
        number: `${process.argv[4]}`
      }).save().then((data) => {
        console.log(`added ${data.name} number ${data.number} to phonebook`)
      })
    }
  })

}

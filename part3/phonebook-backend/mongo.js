require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const url = process.env.MONGODB_URI

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
}

mongoose.connect(url, clientOptions)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

  return
}

if (process.argv.length !== 5) {
  console.log('Usage: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

person.save().then((result) => {
  console.log(`added ${person.name} number ${person.number} to phonebook`)
  console.log(result)
  mongoose.connection.close()
})

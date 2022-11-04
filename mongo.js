const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length === 4) {
  console.log('Usage: node mongo <db-password> (<name to add> <phone number to add>)')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3] || ''
const phone = process.argv[4] || ''

const url = `mongodb+srv://fullstack:${password}@cluster0-k5ddz.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Person', personSchema) // store in collection 'persons or people' (1st param, lowercase plural!)

if (name) { // we should also have a phoneNumber, and we're adding a name to phone book
  const person = new Person({ name, phone })

  person.save()
    .then((resp) => {
      console.log(`added ${resp.name} number ${resp.phone} to phonebook`)
      mongoose.connection.close()
    })
} else { // just supposed to print out current list
  console.log('phonebook:')
  Person.find({})
    .then(result => {
      result.forEach(person => {console.log(`${person.name} ${person.phone}`)})
      mongoose.connection.close()
    })
}

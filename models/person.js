const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to: ', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB, error: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: (v) => {
        const parts = v.split('-')
        return parts.length === 2 && /\d{2}-\d{5,}|\d{3}-\d{4,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Apply the uniqueValidator plugin to personSchema.
personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema) // store in collection 'people' (1st param, lowercase plural!)

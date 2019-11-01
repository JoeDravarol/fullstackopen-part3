const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URL

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    unique: true
  },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
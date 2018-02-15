
const mongoose = require('mongoose')
//const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema


const roomSchema = new Schema({
    title: String,
    description: String,
    photos: [String],
    price: Number,
    ratingValue: {
      type: Number,
      default: null
    },
    reviews: {
      type: Number,
      default: 0
    },
    city: String,
    loc: {
      type: [Number], // Longitude et latitude
      index: '2d' // Créer un index geospatial https://docs.mongodb.com/manual/core/2d/
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
})

module.exports = mongoose.model("Room", roomSchema)

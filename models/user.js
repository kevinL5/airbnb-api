
const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const userSchema = new Schema({
    account: {
        username: { 
            type: String,
            unique: true,
            uniqueCaseInsensitive: true,
            required: [true, 'username required']
        },
        biography: { 
            type: String,
            required: [true, 'biography required']
        },
     },
     email: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        required: [true, 'email required']
     },
     token: String,
     hash: String,
     salt: String
})

userSchema.plugin(uniqueValidator, { message: '{PATH} should to be unique.' }
)

userSchema.path('account.username').validate((value) => {
    return ( value.length > 1 && value.length < 21 )
}, 'username length should be between 2 and 20')

userSchema.path('account.biography').validate((value) => {
    return ( value.length > 9 && value.length < 101 )
}, 'biography length should be between 10 and 100')

userSchema.path('email').validate((value) => {
    return  regexEmail.test(value)
}, '{VALUE} is not a valid email')

module.exports = mongoose.model("User", userSchema)

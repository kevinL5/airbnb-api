const express = require('express')
const mongoose = require('mongoose')

const app = express()
mongoose.connect('mongodb://localhost:27017/airbnb-api')

//Models
const User = require('./models/user')

//Routes
const userRoutes = require('./routes/api-user')
const roomRoutes = require('./routes/api-room')

app.use('/api/user', userRoutes)
app.use('/api/room', roomRoutes)

app.listen(3000, () => {
    console.log("Server started")
})
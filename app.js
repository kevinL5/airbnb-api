const express = require('express')
const app = express()
const uid2 = require('uid2')
var uniqid = require('uniqid')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const SHA256 = require("crypto-js/sha256")
const encBase64 = require('crypto-js/enc-base64')

const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/airbnb-api')

app.use(bodyParser.json())

app.get('/api/user/:id', (req, res) => {
    
})

app.post('/api/user/log_in', logIn)

app.post('/api/user/sign_up', signUp)

app.listen(3000, () => {
    console.log("Server started")
})


function logIn(req, res, next) {
    User.findOne({ email: req.body.email })
        .select('_id account token hash salt')
        .exec((err, user) => {
            var hash = SHA256(req.body.password + user.salt).toString(encBase64)

            if (user.hash == hash ) {
                return res.json({
                    "_id": user._id,
                    "token": user.token,
                    "account": {
                        "username": user.account.username,
                        "biography": user.account.biography
                    }
                })
            }
            res.status(401).send('Error: authentication failed')
        })

}

function signUp(req, res, next) {
    const body = req.body
    const salt = uid2(64)
    const hash = SHA256(req.body.password + salt).toString(encBase64)
    const token = uniqid(uid2(32))

    const user = new User ({
        "account": {
            "username": req.body.username,
            "biography": req.body.biography
         },
         "email": req.body.email,
         token, hash, salt
    })

    user.save((err, user) => {
        if (err) res.status(500).send(`Error: couldn't sign up. ${err}`)
        if (!err) res.json({
            "_id": user._id,
            "token": user.token,
            "account": {
                "username": user.account.username,
                "biography": user.account.biography
            }
        })
    })
}
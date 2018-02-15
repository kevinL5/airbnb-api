const express = require('express')
const SHA256 = require("crypto-js/sha256")
const encBase64 = require('crypto-js/enc-base64')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const uid2 = require('uid2')
const uniqid = require('uniqid')

const User = require('../models/user')
const confirmEmail = require('../controllers/confirm-email.js')

const router = express.Router()

router.use(bodyParser.json())

//Routes
router.get('/verify/:id/:token', verifyToken)

router.post('/log_in', logIn)

router.post('/sign_up', signUp)

router.get('/:id', userAccount)

module.exports = router

//Controllers
function verifyToken(req, res) {
    User.findById(req.params.id)
        .exec( (err, user) => {
            if(!user) {
                return res.status(401).json({
                    message: "Couldn't confirm your email"
                })
            } 

            if (user.token === req.params.token) {
                user.emailVerified = true

                user.save((err) => {
                    if (!err) {
                        console.log(user)
                        res.json({
                            message: "Your email is now verify"
                        })
                    }
                })  
            }
        })
}

function logIn (req, res) {
    User.findOne({ email: req.body.email })
        .select('_id account token hash salt')
        .exec((err, user) => {
            if (user) {
                const hash = SHA256(req.body.password + user.salt).toString(encBase64)

                if (user.hash == hash ) {
                    return res.json({
                        "_id": user._id,
                        "token": user.token,
                        "account": user.account
                    })
                }
            }
            res.status(401).send('Error: authentication failed')
        })
}

function signUp (req, res) {
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
        if (err) return res.status(500).send(`Error: couldn't sign up. ${err}`)
        if (!err) res.json({
            "_id": user._id,
            "token": user.token,
            "account": {
                "username": user.account.username,
                "biography": user.account.biography
            }
        })
        confirmEmail({
            username: user.account.username,
            email: "kevin@lereacteur.io",
            url: `http://localhost:3000/api/user/verify/${user._id}/${user.token}`
        })
    })
}

function userAccount (req, res) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            "error": {
                "code": 48326,
                "message": "Invalid token"
            }
        })
    }

    const token = req.headers.authorization.slice(7)

    User.findOne({ token })
        .select('_id account token')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(401).json({
                    "error": {
                        "code": 9473248,
                        "message": "Invalid token"
                    }
                })
            }

            res.json({
                "_id": user._id,
                "account": user.account
            }) 
        })

}
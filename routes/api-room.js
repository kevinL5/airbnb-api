const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//Middlewear
router.use(bodyParser.json())

//Models
const User = require('../models/user')
const Room = require('../models/room')


//Routes

router.post('/publish', publishRoom)

router.get('/:id', (req, res) => {
    Room.findById(req.params.id)
        .populate({ path: 'user', select: 'account.username' })
        .exec((err, room) => {
            if (!err && room) {
                return res.json({
                    "_id": room._id,
                    "title": room.title,
                    "description": room.description,
                    "photos": room.photos,
                    "price": room.price,
                    "city": room.city,
                    "loc": room.loc,
                    "ratingValue": room.ratingValue,
                    "reviews": room.reviews,
                    "user": room.user
                })
            }
            res.status(401).json({
                message: 'Error no room find'
            })
        })

})

module.exports = router

//Controllers
function publishRoom(req, res) {
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
        .select('account.username rooms')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(401).json({
                    "error": {
                        "code": 9473248,
                        "message": "Invalid token"
                    }
                })
            }
            
            const room = new Room({
                title: req.body.title ,
                description: req.body.description ,
                photos: req.body.photos ,
                price: req.body.price ,
                city: req.body.city ,
                loc: req.body.loc,
                user: user
            })

            room.save((err) => {
                if (!err) {
                    const userRooms = user.rooms
                    user.rooms = [...userRooms, room._id]
                    
                    user.save((err) => {
                        if (!err) {
                            res.json({
                                "_id": room._id,
                                "title": room.title,
                                "description": room.description,
                                "photos": room.photo,
                                "price": room.price,
                                "city": room.city,
                                "loc": room.loc,
                                "ratingValue": room.ratingValue,
                                "reviews": 0,
                                "user": {
                                  "_id": user._id,
                                  "account": {
                                    "username": user.account.username
                                  }
                                }
                            })
                        }
                    })
                   
                }
            })
        })
}
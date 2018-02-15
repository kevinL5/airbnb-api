const express = require("express")
const router = express.Router()

//Routes
app.all('*', error)

module.exports = router;

//Controllers
function error (req, res) {
    res.status(404).send('404')
}
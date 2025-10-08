require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyPaser = require('body-parser')
const app = express()

app.use(bodyPaser.json())
app.use(cors())
app.use('/api/auth', require('./app/routes/auth'))

app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem Vindo a Nossa API!'})
})

const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME 

mongoose.connect(`mongodb://mongo:${DB_PORT}/${DB_NAME}`)
    .then(() => {
        app.listen(process.env.PORT)
        console.log('Conectado ao MongoDB')
    })
    .catch(err => console.error(err))


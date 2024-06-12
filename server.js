require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyPaser = require('body-parser')
const app = express()

app.use(bodyPaser.json())
app.use(cors())
app.use('/api/auth', require('./routes/auth'))

app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem Vindo a Nossa API!'})
})

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@test.7ts2zqd.mongodb.net/?retryWrites=true&w=majority&appName=Test`)
    .then(() => {
        app.listen(process.env.PORT)
        console.log('Conectado ao MongoDB')
    })
    .catch(err => console.error(err))


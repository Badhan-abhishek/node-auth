/* eslint-disable no-console */
const express = require('express')
const mongoose = require('mongoose')
const setupRoutesV1 = require('./routes/routes')

// eslint-disable-next-line new-cap
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
require('dotenv').config()

const MONGO_URI = process.env.DB_URI

mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

// Creating mongodb connection
mongoose.connect(MONGO_URI).catch((err) => {
  console.log(
    `MongoDB connection error. Please make sure MongoDB is running. ${err}`,
  )
  process.exit(1)
})

setupRoutesV1(app)

const { PORT } = process.env
// Running server
app.listen(PORT, console.log(`App is running on localhost:${PORT}`))

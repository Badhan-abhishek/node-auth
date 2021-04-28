const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('RefreshToken', TokenSchema)

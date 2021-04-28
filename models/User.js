/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose')
const Bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.pre('save', (next) => {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = Bcrypt.hashSync(this.password, 10)
  next()
})

UserSchema.methods.comparePassword = (plaintext) => {
  Bcrypt.hash(plaintext, 10, (err, hash) => {
    if (err) {
      throw err
    }

    Bcrypt.compare(plaintext, hash, (error, result) => {
      if (error) {
        throw error
      }
      return result
    })
  })
}

UserSchema.methods.generateAuthToken = () => jwt.sign(
  { _id: this._id, email: this.email },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.TOKEN_EXPIRE_TIME },
)

UserSchema.methods.generateRefreshToken = () => jwt.sign(
  { _id: this._id, email: this.email },
  process.env.REFRESH_TOKEN_SECRET,
)

module.exports = mongoose.model('User', UserSchema)

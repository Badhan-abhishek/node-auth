const Joi = require('joi')
const jwt = require('jsonwebtoken')
const { ValidateBody } = require('../../../helpers')
const RefreshToken = require('../../../models/RefreshToken')
const User = require('../../../models/User')

const roles = ['Admin', 'User']

const testing = async (req, res) => res.json({
  working: 'working',
})

const signUp = async (req, res) => {
  ValidateBody(
    {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      role: Joi.string().valid(...roles),
    },
    req.body,
    res,
  )

  try {
    const userExist = await User.exists({ firstName: req.body.email })
    if (userExist) {
      return res.json({
        status: false,
        message: 'User already exist!',
      })
    }
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    })
    await user.save()
    return res.json({
      status: true,
      message: 'User created!',
    })
  } catch (error) {
    return res.json({
      status: false,
      message: error,
    })
  }
}

const login = async (req, res) => {
  ValidateBody(
    {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    req.body,
    res,
  )
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.json({ status: false, message: 'User does not exists' })

  const { password } = req.body
  if (user.comparePassword(password)) return res.json({ status: false, message: 'Wrong credentials' })

  try {
    const accessToken = user.generateAuthToken()
    const refreshToken = user.generateRefreshToken()
    const saveToken = new RefreshToken({ token: refreshToken })
    await saveToken.save()
    return res.json({ accessToken, refreshToken })
  } catch (error) {
    return res.json({ status: false, message: error })
  }
}

const token = async (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  const tokenExists = RefreshToken.findOne({ token: req.body.token })
  if (!tokenExists) return res.sendStatus(403)
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      const currentUser = await User.findOne({ email: user.email })
      if (err) return res.sendStatus(403)
      const accessToken = currentUser.generateAuthToken()
      return res.json({ accessToken })
    },
  )
  return true;
}

const logout = async (req, res) => {
  // refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
  try {
    await RefreshToken.deleteOne({ token: req.body.token })
    return res.json({
      status: true,
      message: 'User logged out!',
    })
  } catch (error) {
    return res.json({
      status: true,
      message: error,
    })
  }
}

module.exports = {
  signUp,
  testing,
  login,
  token,
  logout,
}

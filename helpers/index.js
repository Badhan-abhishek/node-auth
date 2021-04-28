const Joi = require('joi')

const ValidateBody = (object, validateWith, res) => {
  const schema = Joi.object(object)

  const { error } = schema.validate(validateWith)
  if (error) {
    return res.json({
      status: false,
      message: error.details[0].message,
    })
  }
}

module.exports = {
  ValidateBody,
}

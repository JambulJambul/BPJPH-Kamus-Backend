const Joi = require('joi');

// Validation schema for user attributes
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  // Add more validations for other user attributes if needed
});


module.exports = {
  userSchema,
};

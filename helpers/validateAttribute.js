const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string(),
});

const EntrySchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  references: Joi.string().required(),
})


module.exports = {
  userSchema,
  registrationSchema,
  EntrySchema
};
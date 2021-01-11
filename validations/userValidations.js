const Joi = require("joi");

module.exports = {
  createValidation: request => {
    const createSchema = {
      username: Joi.string()
        .min(1)
        .max(500)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required()
    };
    return Joi.validate(request, createSchema);
  },

  updateValidation: request => {
    const updateSchema = {
      password: Joi.string().min(8)
    };

    return Joi.validate(request, updateSchema);
  }
};
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
        .required(),
       firstname:Joi.string()
       .required(),
       lastname:Joi.string()
       .required(),
       birthdate:Joi.date()
       .required(),
       gender:Joi.string()
       .required(),
       city:Joi.string()
       .required(),
       address:Joi.string(),
       role:Joi.string()
       .required(),
       approved:Joi.boolean()
     

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
import Joi from "joi"; //import joi

const authValidator = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});

export { authValidator };

const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateItemBody = celebrate({
  body: Joi.object({
    name: Joi.string().trim().min(2).max(30).required(),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }).unknown(true),
});

const validateUserBody = celebrate({
  body: Joi.object({
    name: Joi.string().trim().min(2).max(30).required(),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(true),
});

const validateLoginBody = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(true),
});

const validateId = (paramName = "id") =>
  celebrate({
    params: Joi.object().keys({
      [paramName]: Joi.string().hex().length(24).required(),
    }),
  });

const validateItemId = validateId("itemId");
const validateUserId = validateId("userId");

module.exports = {
  validateItemBody,
  validateUserBody,
  validateLoginBody,
  validateId,
  validateItemId,
  validateUserId,
  validateURL,
  validateCreateItem: validateItemBody,
  validateCreateUser: validateUserBody,
  validateAuthentication: validateLoginBody,
};

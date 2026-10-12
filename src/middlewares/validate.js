const Joi = require("joi");
const ApiResponse = require("../configs/api_response");

function validate(schema) {
  return function (req, res, next) {
    const { error } = schema.validate(req.body);

    if (error)
      return ApiResponse.validation(res, error.details[0].message, 400);
    next();
  };
}
module.exports = validate;

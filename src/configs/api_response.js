const success = (res, result) => {
  let successResponse = {
    message: "OK",
    RESPONSE: "SUCCESS",
    statusCode: 200,
    result,
  };
  return res.status(200).send(successResponse);
};
const farmerExist = (res, result) => {
  let successResponse = {
    message: "Farmer already exists with this phone number",
    RESPONSE: "SUCCESS",
    statusCode: 201,
    result,
  };
  return res.status(201).send(successResponse);
};

const isAlreadyExist = (res, statusCode, message, data) => {
  let successResponse = {
    message: message,
    RESPONSE: "SUCCESS",
    statusCode: 200,
    result: data,
  };
  return res.status(statusCode).send(successResponse);
};

const isNotApprovedAlreadyExist = (res, statusCode, message, data) => {
  let successResponse = {
    message: message,
    RESPONSE: "FAILURE",
    statusCode: 200,
    result: data,
  };
  return res.status(statusCode).send(successResponse);
};

const error = (res, message, statusCode, result) => {
  let errorResponse = {
    message,
    RESPONSE: "FAILURE",
    statusCode,
    result,
  };
  return res.status(statusCode).send(errorResponse);
};
const validation = (res, message, statusCode) => {
  let validationResponse = {
    message,
    RESPONSE: "FAILURE",
    statusCode,
    result: null,
  };
  return res.status(400).send(validationResponse);
};

module.exports = {
  success,
  error,
  validation,
  farmerExist,
  isAlreadyExist,
  isNotApprovedAlreadyExist,
};

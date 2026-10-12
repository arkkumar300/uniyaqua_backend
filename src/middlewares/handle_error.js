const ApiResponse = require("../configs/api_response");
module.exports = function (err, req, res, next) {
  let message;
  console.log(" Err ",err)
    message = err.message ? err.message : 'Something went wrong';
  ApiResponse.error(res, message, 404);
};

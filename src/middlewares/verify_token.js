const jwt = require("jsonwebtoken");
const SECRECT_KEY = require("../helpers/constants");
const ApiResponse = require("../configs/api_response");
const User = require("../models/user");
const LabAssistant = require("../models/labAssistant");

const verifyToken = async (req, res, next) => {
  // Support both Authorization and authtoken headers
  const authHeader =
    req.headers.authorization || req.headers.authtoken;

  // Check for a missing or invalid token value
  if (
    !authHeader ||
    typeof authHeader !== "string" ||
    ["null", "undefined", ""].includes(authHeader.trim().toLowerCase())
  ) {
    return ApiResponse.error(res, "No User Token", 401);
  }

  // Support both "Bearer <token>" and plain JWT tokens
  const token = authHeader.trim().replace(/^Bearer\s+/i, "").trim();

  if (
    !token ||
    ["null", "undefined"].includes(token.toLowerCase())
  ) {
    return ApiResponse.error(res, "No User Token", 401);
  }

  try {
    // Verify JWT
    const verifiedToken = jwt.verify(token, SECRECT_KEY);

    const uuid = verifiedToken.uuid;

    if (!uuid) {
      return ApiResponse.error(res, "Invalid Token Payload", 401);
    }

    // Find user in either table
    const user = await User.findOne({ where: { uuid } });

    const labAssistant = user
      ? null
      : await LabAssistant.findOne({ where: { uuid } });

    if (!user && !labAssistant) {
      return ApiResponse.error(res, "User not found", 404);
    }

    // Attach authenticated user to request
    req.user = user?.dataValues || labAssistant?.dataValues;

    // Ensure req.body exists
    req.body = req.body || {};
    req.body.user = req.user;

    return next();
  } catch (err) {
    console.error("Token verification error:", err.message);

    if (err.name === "TokenExpiredError") {
      return ApiResponse.error(res, "Token Expired. Please Login Again", 401);
    }

    if (err.name === "JsonWebTokenError") {
      return ApiResponse.error(res, "Invalid Token", 401);
    }

    return ApiResponse.error(res, "Authentication Failed", 500);
  }
};

module.exports = verifyToken;
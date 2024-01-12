const jwt = require("jsonwebtoken");

const HttpError = require("../models/httpError");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("인증이 실패했습니다.");
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch {
    const error = new HttpError("인증이 실패했습니다.", 401);
    return next(error);
  }
};

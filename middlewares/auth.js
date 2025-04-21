const JWT = require("../services/Jwt");


const auth = (req, res, next) => {

  // Check for Authorization header
  let headAuth = req.headers.authorization;
  if (!headAuth) {
    return next(new Error('Unauthorized: No token provided.'));
  }
 
  // Extract the token from header
  const token = headAuth.split(' ')[1];
  if (!token) {
    return next(new Error('Unauthorized: Malformed token.'));
  }

  try {
    // Verify token and extract _id
    const { _id } = JWT.verify(token);
    req.user = { _id };
    next();
  } catch (err) {
    // Handle token verification errors
    return next(new Error('Unauthorized: Invalid or expired token.'));
  }
};

module.exports = auth;

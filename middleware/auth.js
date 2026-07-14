const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { HTTP_STATUS } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //!authorization — Checks if the authorization header is missing entirely. No badge at all!
  //!authorization.startsWith("Bearer ") — Checks if the header doesn't start with "Bearer ". Think of "Bearer" like the type of badge required — if it's the wrong type, you're still not getting in.
  //|| — Means if either of those conditions is true, the check fails.
  if (!authorization || !authorization.startsWith("Bearer ")) {
    //return res.status(HTTP_STATUS.UNAUTHORIZED).send(...) — If the check fails, it stops the request and sends back a 401 Unauthorized response with the message "Authorization required"
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }
  //authorization.replace("Bearer ", "") — Strips the word "Bearer " from the token string, leaving just the raw token. Think of it like removing the envelope to get to the letter inside
  const token = authorization.replace("Bearer ", "");

  try {
    // jwt.verify(token, JWT_SECRET) — Checks if the token is valid and authentic using your secret key. Like checking if a passport is genuine
    const payload = jwt.verify(token, JWT_SECRET);
    //req.user = payload — Stores the decoded user info onto the request, so other parts of the app know who is making the request.
    req.user = payload;
    // return next() — If everything checks out, it passes the request along to the next step
    return next();
    // The catch block — If the token is invalid or expired, it sends back a 401 UNAUTHORIZED error with the message "Invalid token"
  } catch (err) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "Invalid token" });
  }
};

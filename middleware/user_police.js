const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_serves");

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).send({ message: "Token berilmagan" });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    if (bearer !== "Bearer" || !token) {
      return res.status(403).send({ message: "Token Noto'g'ri!" });
    }
    const [error, decodedToken] = await to(myJwt.verifyAccessToken(token));
    if (error) {
      return res.status(403).send({ error: error.message });
    }
    req.user = decodedToken;
    // console.log(req);
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "User ro'yxatdan o'tmagan" });
  }
};

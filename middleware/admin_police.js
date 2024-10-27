const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_serves");

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).send({ message: "Token berilmagan!" });
    }
    const [bearer, token] = authorization.split(" ");


    if (bearer !== "Bearer" || !token) {
      return res.status(403).send({ message: "Token noto'g'ri!" });
    }

    const [error, decodedToken] = await to(myJwt.verifyAccessToken(token));
    if (error) {
      return res.status(403).send({ message: error.message });
    }
    req.admin = decodedToken;
    next();
    
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "Xatolik yuz berdi!" });
  }
};

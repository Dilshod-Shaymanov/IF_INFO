const myJwt = require("../services/jwt_serves");
const config = require("config");
const tokenSaveDb = (payload,saveDb) => {

  const tokens = myJwt.generateTokens(payload);
  saveDb.token = tokens.refreshToken;
  saveDb.save();

  return tokens;
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: config.get("refresh_time_ms"),
  });
};


module.exports = {
  tokenSaveDb,setRefreshTokenCookie
};

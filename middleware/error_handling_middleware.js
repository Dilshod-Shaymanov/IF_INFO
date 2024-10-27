const ApiError = require("../errors/api_error");

module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).send({ message: err.message });
  }
  if (err instanceof SyntaxError) {
    return res.status(err.status).send({ message: err.message });
  }

  return res.status(500).send({ message: "Nazarda tutilmagan xatolik!" });
};

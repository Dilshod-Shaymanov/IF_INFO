const errorHandler = (res, error) => {
  console.log(error);
  res.status(400).send({ error: error.message });
};

module.exports = {
  errorHandler,
};

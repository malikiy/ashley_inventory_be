exports.resSuccess = (res, message, data = null, code = 200) => {
  res.status(code).json({ status: "success", message, data });
};

exports.resError = (res, message, code = 500) => {
  res.status(code).json({ status: "error", message, data: null });
};

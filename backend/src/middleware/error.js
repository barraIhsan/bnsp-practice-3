export const errorMiddleware = (err, _req, res, _next) => {
  // sql duplicate
  if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
    err.status = 400;
    err.message = "Data already exists";
  }

  const statusCode = err.status || 500;
  const bodyStatus = statusCode <= 500 ? "fail" : "error";

  res.status(statusCode).json({
    status: bodyStatus,
    message: err.message || "Internal Server Error",
  });
};

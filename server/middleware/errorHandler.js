export default function errorHandler(error, req, res, next) {
  console.error(error);

  return res.status(500).json({
    message: "An unexpected server error occurred."
  });
}
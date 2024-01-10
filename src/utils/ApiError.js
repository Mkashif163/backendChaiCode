class ApiErrors extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    statck = "",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.stack = statck;
    this.success = false;
    this.data = null;
    this.message = message;

    if (statck) {
      this.stack = statck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

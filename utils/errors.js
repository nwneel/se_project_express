const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = HTTP_STATUS.BAD_REQUEST;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = HTTP_STATUS.FORBIDDEN;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = HTTP_STATUS.NOT_FOUND;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = HTTP_STATUS.CONFLICT;
  }
}

module.exports = {
  HTTP_STATUS,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};

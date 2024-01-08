'use strict';

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  BAD_REQUEST: 400,
};

const ReasonStatusCode = {
  FORBIDDEN: 'Forbidden access',
  CONFLICT: 'Conflict error',
  BAD_REQUEST: 'Bad request',
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class ForbiddenRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  ForbiddenRequestError,
  BadRequestError,
};

import { ErrorRequestHandler } from "express";
import { ValidateError } from "tsoa";
import { HTTPStatusCode } from "../utils/httpStatusCode.util.js";
import logMessage, { Severity } from "../utils/loggerUtil.util.js";
import {
  AuthError,
  BadInputError,
  BadRequestError,
  NotFoundError,
} from "./Errors.js";

// noinspection JSUnusedLocalSymbols
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ValidateError) {
    logMessage("Validation Error", "Error handler middleware", error.stack || error.message, Severity.ERROR);
    res.status(400).end();
  } else if (error instanceof NotFoundError) {
    logMessage("Not Found Error", "Error handler middleware", error.stack || error.message, Severity.ERROR);
    res.status(HTTPStatusCode.OK).end();
  } else if (error instanceof BadInputError) {
    logMessage("Bad Input Error", "Error handler middleware", error.stack || error.message, Severity.ERROR);
    res.status(HTTPStatusCode.BAD_REQUEST).end();
  } else if (error instanceof BadRequestError) {
    logMessage("Bad Request Error", "Error handler middleware", error.stack || error.message, Severity.ERROR);
    res.status(HTTPStatusCode.BAD_REQUEST).end();
  } else if (error instanceof AuthError) {
    logMessage("Auth Error", "Error handler middleware", error.stack || error.message, Severity.ERROR);
    res.status(HTTPStatusCode.UNAUTHORIZED).end();
  } else {
    logMessage("Internal server error", "Error handler middleware", error.stack || error.message, Severity.ERROR);
    res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).end();
  }
};

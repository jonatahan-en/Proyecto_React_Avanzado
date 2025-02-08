import { isAxiosError } from "axios";

type ErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "API_CLIENT_ERROR";

export class ApiClientError extends Error {
  code: ErrorCode;

  constructor(message: string, code: ErrorCode = "API_CLIENT_ERROR") {
    super(message);
    this.code = code;
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function normalizeError(error: unknown): ApiClientError {
  // Unknown Error
  const apiClientError = new ApiClientError("Api Client Error");

  if (error instanceof Error) {
    // Error instance
    apiClientError.message = error.message;

    if (isAxiosError<{ message: string; statusCode: number }>(error)) {
      // AxiosError instance
      apiClientError.message =
        error.response?.data.message ??
        error.response?.statusText ??
        apiClientError.message;
      const errorCode = error.code;
      const errorStatus =
        error.response?.data.statusCode ??
        error.response?.status ??
        error.status;

      if (errorCode === "ERR_NETWORK") {
        apiClientError.code = "NETWORK_ERROR";
      }
      if (typeof errorStatus === "number") {
        if (errorStatus === 401) {
          apiClientError.code = "UNAUTHORIZED";
        } else if (errorStatus === 404) {
          apiClientError.code = "NOT_FOUND";
        } else if (errorStatus >= 500) {
          apiClientError.code = "SERVER_ERROR";
        }
      }
    }
  }

  return apiClientError;
}

export default class LogiError extends Error {
  message!: string;

  type!: string;

  status!: number;

  body: {
    status: string;
    message: string;
  };

  constructor(message: string, type: string, status: number) {
    super();
    this.message = message;
    this.type = type;
    this.status = status;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LogiError);
    }

    this.name = 'LogiValidationError';
    this.body = {
      status: 'error',
      message: this.message,
    };
  }
}

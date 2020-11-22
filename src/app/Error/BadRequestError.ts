import LogiError from './LogiError';

export default class BadRequestError extends LogiError {
  constructor(details: string) {
    const defaultMessage = 'Invalid request arguments';
    const message = details || defaultMessage;
    super(message, 'badRequest', 400);
  }
}

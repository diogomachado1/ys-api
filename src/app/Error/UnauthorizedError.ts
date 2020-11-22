import LogiError from './LogiError';

export default class UnauthorizedError extends LogiError {
  constructor() {
    super('Unauthorized', 'unauthorized', 401);
  }
}

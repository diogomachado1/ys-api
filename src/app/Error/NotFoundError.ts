import LogiError from './LogiError';

export default class NotFoundError extends LogiError {
  constructor(entity: string) {
    super(`${entity} not found`, 'notFound', 404);
  }
}

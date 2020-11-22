import crypto from 'crypto';
import BadRequestError from '../../Error/BadRequestError';
import Repository from './Repository';
import { IHash } from './Model';
// import HashValidator from '../Validators/MealValidator';
// import { notFound } from '../Error/TypeErrors';

class HashServices {
  protected repository = Repository;

  async verifyAndGetHash(hash: string, type: string) {
    const hashDb = await this.repository.getHashByHash(hash, type);
    if (!hashDb) throw new BadRequestError('Invalid token');
    return hashDb;
  }

  async create(
    userId: string,
    type: 'CONFIRM_EMAIL' | 'CHANGE_PASSWORD' = 'CONFIRM_EMAIL'
  ) {
    const payload = {
      type,
      hash: crypto.randomBytes(40).toString('hex'),
    };

    const hash = await this.repository.createOne({
      ...payload,
      user: userId,
    } as IHash);
    return hash;
  }

  async delete(
    userId: string,
    type: 'CONFIRM_EMAIL' | 'CHANGE_PASSWORD' = 'CONFIRM_EMAIL'
  ) {
    await this.repository.deleteHashByUserIdAndType(userId, type);
    return true;
  }
}

export default new HashServices();

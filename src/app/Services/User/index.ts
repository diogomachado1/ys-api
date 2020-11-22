import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import ValidateDecorator from '@app/utils/ValidateDecorator';
import validId from '@app/utils/validId';
import HashService from '../Hash';
import UserValidator from './Validator';
import Queue from '../../../lib/Queue';
import ConfirmEmail from '../../jobs/ConfirmEmail';
import ForgetPassword from '../../jobs/ForgetPassword';
import NotFoundError from '../../Error/NotFoundError';
import BadRequestError from '../../Error/BadRequestError';
import { IUser } from './Model';
// import ProjectService from '../Project/ProjectService';
import authConfig from '../../../config/auth';
import Repository from './Repository';

class UserServices {
  protected repository = Repository;

  protected validator = UserValidator;

  async confirmEmail(hash: string) {
    const hashDb = await HashService.verifyAndGetHash(hash, 'CONFIRM_EMAIL');
    await this.repository.updateOne({ active: true }, hashDb.user);
    await HashService.delete(hashDb.user, 'CONFIRM_EMAIL');
  }

  @ValidateDecorator(1, 'updatePassword')
  async forgetPassword(hash: string, data: Partial<IUser>) {
    const { password } = data;
    const hashDb = await HashService.verifyAndGetHash(hash, 'CHANGE_PASSWORD');

    await this.repository.updateOne({ password }, hashDb.user);
    await HashService.delete(hashDb.user, 'CHANGE_PASSWORD');
  }

  async verifyAndGetUserByEmail(email: string) {
    const user = await this.repository.getUserByEmail(email);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async getAllInLive() {
    const user = await this.repository.getAllInLive();
    return user;
  }

  async getStreamByUsername(usernameToFind: string) {
    const user = (
      await this.repository.getStreamByUsername(usernameToFind)
    )?.toObject();
    if (!user) throw new NotFoundError('User');
    const { stream, imageUrl, inLive, name, username, id, about } = user;
    return { stream, imageUrl, inLive, name, username, id, about };
  }

  async verifyAndGetUserByEmailWithoutError(email: string) {
    const user = await this.repository.getUserByEmail(email);
    return user;
  }

  @validId('user', 0)
  async verifyAndGetUserById(id: string) {
    const user = await this.repository.getUserById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async verifyIfUniqueEmail(email: string) {
    const user = await this.repository.getUserByEmail(email);
    if (user) throw new BadRequestError('User already exists');
    return user;
  }

  async createForgetPasswordHash(email: string) {
    if (!email) throw new BadRequestError('Email is required');
    const { id, name, active } = await this.verifyAndGetUserByEmail(email);
    if (!active) throw new BadRequestError('Email need confirmed');

    const { hash } = await HashService.create(id, 'CHANGE_PASSWORD');
    await Queue.add(ForgetPassword.key, { name, email, hash });
  }

  async createConfirmEmailHash(email: string, user?: IUser) {
    if (!email) throw new BadRequestError('Email is required');
    const { id, name, active } =
      user || (await this.verifyAndGetUserByEmail(email));
    if (active) throw new BadRequestError('Email already confirmed');
    const { hash } = await HashService.create(id);

    await Queue.add(ConfirmEmail.key, { name, email, hash });
  }

  @ValidateDecorator(0, 'createValidator')
  async create(data: IUser) {
    await this.verifyIfUniqueEmail(data.email);

    data.streamKey = uuidv4();
    const user = await this.repository.createOne(data);

    await this.createConfirmEmailHash(user.email, user);

    return user;
  }

  async newKey(userId: string) {
    await this.verifyAndGetUserById(userId);

    await this.repository.updateOne({ streamKey: uuidv4() }, userId);

    const { streamKey } = await this.verifyAndGetUserById(userId);

    return { streamKey };
  }

  @validId('user', 1)
  @ValidateDecorator(0, 'updateValidator')
  async update(data: UserUpdate, userId: string) {
    const { oldPassword } = data;

    const user = await this.verifyAndGetUserById(userId);

    if (oldPassword && !(await bcrypt.compare(oldPassword, user.password))) {
      throw new BadRequestError('Password does not match');
    }

    await this.repository.updateOne(data, userId);

    const userSaved = await this.verifyAndGetUserById(userId);

    return userSaved;
  }

  @ValidateDecorator(0, 'sessionValidator')
  async session(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await this.verifyAndGetUserByEmailWithoutError(email);

    if (!user) throw new BadRequestError('Invalid credentials');

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestError('Invalid credentials');
    }

    const { id, name, imageUrl } = user;

    return {
      user: { id, name, email, imageUrl },
      token: jwt.sign({ id }, (authConfig.secret as string) || 'aaaa', {
        expiresIn: authConfig.expiresIn,
      }),
    };
  }

  async verifyKey(body: { username: string; key: string }) {
    if (!body || !body.username || !body.key) return { valid: false };
    const { username, key } = body;
    const user = await this.repository.getUserByUsernameAndKey(username, key);
    if (user) return { valid: true };
    return { valid: false };
  }

  async changeLiveStatus(username: string, inLive: boolean) {
    return this.repository.changeLiveStatus(username, inLive);
  }
}

interface UserUpdate extends IUser {
  oldPassword?: string;
}

export default new UserServices();

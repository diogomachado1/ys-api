// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import {
  createProjectWith2Members,
  createTokenAndUser,
} from '@tests/util/functions';
import { IUser } from '@app/Services/User/Model';
import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../app';

jest.mock('../../lib/Queue', () => ({
  add: jest.fn().mockResolvedValue(undefined),
  addRepeatJob: jest.fn().mockResolvedValue(undefined),
  remove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../lib/Redis', () => ({
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue(undefined),
  invalidate: jest.fn().mockResolvedValue(undefined),
  invalidatePrefix: jest.fn().mockResolvedValue(undefined),
}));

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const user = (await factory.attrs('User')) as IUser;

    const response = await request(app.server).post('/v1/pub/users').send(user);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register a registed email', async () => {
    const user = (await factory.attrs('User', {
      email: 'admin@logi2.com',
    })) as IUser;

    const response = await request(app.server).post('/v1/pub/users').send(user);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'User already exists',
      status: 'error',
    });
  });

  it('should be able to register and add userId in project with have member with user email', async () => {
    const { token, project } = await createProjectWith2Members('test@ys.com');
    const user = (await factory.attrs('User', {
      email: 'test@ys.com',
    })) as IUser;

    const userResponse = await request(app.server)
      .post('/v1/pub/users')
      .send(user);

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/projectMember`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.members[1].user).toBe(userResponse.body.id);
  });

  it('should be able to update a user', async () => {
    const { token } = await createTokenAndUser();

    const response = await request(app.server)
      .put('/v1/pvt/users')
      .send({
        name: 'test',
        oldPassword: 12345678,
        password: 123456789,
        confirmPassword: 123456789,
      })
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  // it('should not be able to update a user with invalid imageId', async () => {
  //   const { token } = await createTokenAndUser();

  //   const response = await request(app.server)
  //     .put('/v1/pvt/users')
  //     .send({
  //       name: 'test',
  //       imageId: 2,
  //       oldPassword: 12345678,
  //       password: 123456789,
  //       confirmPassword: 123456789,
  //     })
  //     .set('Authorization', `bearer ${token}`);

  //   expect(response.status).toBe(400);
  //   expect(response.body).toStrictEqual({
  //     message: 'Image not found',
  //     status: 'error',
  //   });
  // });

  it('should not be able to update a user with invalid olaPassword', async () => {
    const { token } = await createTokenAndUser();

    const response = await request(app.server)
      .put('/v1/pvt/users')
      .send({
        name: 'test',
        oldPassword: 123456789,
        password: 123456788,
        confirmPassword: 123456788,
      })
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Password does not match',
      status: 'error',
    });
  });
});

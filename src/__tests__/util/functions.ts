import request from 'supertest';
import { IUser } from '@app/Services/User/Model';
import { IProject } from '@app/Services/Project/Model';
import factory from '../factories';

import app from '../../app';

async function createTokenAndUser() {
  const { body } = await request(app.server)
    .post('/v1/pub/sessions')
    .send({ email: 'admin@ys.com', password: '12345678' });
  return { token: body.token, user: body.user as IUser };
}
async function createTokenAndUser2() {
  const { body } = await request(app.server)
    .post('/v1/pub/sessions')
    .send({ email: 'admin@logi2.com', password: '12345678' });
  return { token: body.token, user: body.user as IUser };
}
async function createProject() {
  const { user, token } = await createTokenAndUser();
  const project = (await factory.attrs('Project')) as IProject;

  const response = await request(app.server)
    .post('/v1/pvt/projects')
    .set('Authorization', `bearer ${token}`)
    .send(project);
  return { project: response.body as IProject, token, user };
}

async function createProjectWith2Members(email = 'admin@logi2.com') {
  const { token, project, user } = await createProject();

  await request(app.server)
    .post(`/v1/pvt/${project.id}/projectMember`)
    .set('Authorization', `bearer ${token}`)
    .send({ email });

  return { token, project, user };
}

export {
  createTokenAndUser,
  createProject,
  createProjectWith2Members,
  createTokenAndUser2,
};

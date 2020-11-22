import faker from 'faker';
import factory from 'factory-girl';
import User from '@app/Services/User/Model';
import Project from '@app/Services/Project/Model';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Project', Project, {
  name: faker.name.findName(),
});

export default factory;

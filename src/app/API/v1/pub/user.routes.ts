import { Router } from 'express';

import UserServices from '@app/Services/User';

const routes = Router();

routes.post('/users', async (req, res, next) => {
  const { id, name, email } = await UserServices.create(req.body);
  return res.status(201).json({
    id,
    name,
    email,
  });
});

routes.get('/streams', async (req, res, next) => {
  const usersDoc = await UserServices.getAllInLive();
  const users = usersDoc.map((item) => {
    const { username, imageUrl, stream } = item.toObject();
    return { username, imageUrl, stream };
  });
  return res.status(200).json(users);
});

routes.get('/streams/:username', async (req, res, next) => {
  const user = await UserServices.getStreamByUsername(req.params.username);

  return res.status(200).json(user);
});

export default routes;

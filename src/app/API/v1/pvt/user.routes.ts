import { Router } from 'express';

import UserServices from '@app/Services/User';

const routes = Router();

routes.put('/users', async (req, res, next) => {
  const { id, name, email } = await UserServices.update(req.body, req.userId);
  return res.status(200).json({
    id,
    name,
    email,
  });
});

routes.put('/newKey', async (req, res, next) => {
  const { streamKey } = await UserServices.newKey(req.userId);
  return res.status(200).json({ streamKey });
});

routes.get('/user', async (req, res, next) => {
  const user = await (
    await UserServices.verifyAndGetUserById(req.userId)
  ).toObject();
  return res.status(200).json({ ...user, password: undefined });
});

export default routes;

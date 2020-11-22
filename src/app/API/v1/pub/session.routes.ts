import { Router } from 'express';

import UserServices from '@app/Services/User';

const routes = Router();

routes.post('/', async (req, res, next) => {
  const { user, token } = await UserServices.session(req.body);

  return res.status(201).json({
    user,
    token,
  });
});

export default Router().use('/sessions', routes);

import { Router } from 'express';

import UserServices from '@app/Services/User';

const routes = Router();

routes.post('/', async (req, res, next) => {
  const response = await UserServices.verifyKey(req.body);

  return res.status(200).json(response);
});

export default Router().use('/verifyKey', routes);

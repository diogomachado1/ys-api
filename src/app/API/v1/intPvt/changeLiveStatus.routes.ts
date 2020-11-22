import { Router } from 'express';

import UserServices from '@app/Services/User';

const routes = Router();

routes.post('/', async (req, res, next) => {
  await UserServices.changeLiveStatus(req.body.username, req.body.inLive);

  return res.status(204);
});

export default Router().use('/changeLiveStatus', routes);

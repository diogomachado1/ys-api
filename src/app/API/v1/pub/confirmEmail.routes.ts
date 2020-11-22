import { Router } from 'express';
import UserServices from '@app/Services/User';

const routes = Router();

routes.post('/', async (req, res, next) => {
  const {
    body: { email },
  } = req;

  await UserServices.createConfirmEmailHash(email);

  return res.status(204).json();
});

routes.put('/:hash', async (req, res, next) => {
  const {
    params: { hash },
  } = req;
  await UserServices.confirmEmail(hash);

  return res.status(204).json();
});

export default Router().use('/confirmEmail', routes);

import { Router } from 'express';

const routes = Router();

routes.get('/testAuth', (req, res) => res.send({ message: 'ok Auth ys' }));

export default routes;

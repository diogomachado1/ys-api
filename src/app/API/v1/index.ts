import { Router } from 'express';
import auth from './middlewares/auth';
import pubRoutes from './pub';
import intPvtRoutes from './intPvt';
import pvtRoutes from './pvt';
import internalAuth from './middlewares/internalAuth';

const routes = Router();

routes.use('/pub', pubRoutes);
routes.use('/pvt', auth, pvtRoutes);
routes.use('/intPvt', internalAuth, intPvtRoutes);

export default routes;

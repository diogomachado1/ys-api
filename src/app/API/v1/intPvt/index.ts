import { Router } from 'express';

import verifyToken from './verifyToken.routes';
import changeLiveStatus from './changeLiveStatus.routes';

const routes = Router();

routes.use(verifyToken);
routes.use(changeLiveStatus);

export default routes;

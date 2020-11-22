import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../../../../config/multer';

const upload = multer(multerConfig);
const routes = Router();

routes.post('/files', upload.single('file'), async (req, res, next) => {
  // TODO fix key file
  // @ts-ignore
  const { filename: path, key: keyS3 } = req.file;
  const key = path || keyS3;

  return res.json({ path: key });
});

export default routes;

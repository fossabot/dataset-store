import { Router } from 'express';
import Multer from 'multer';

import config from '../config/config';
import { store } from '../models';

const router = Router();

router.post(
  '/',
  Multer({ dest: `./${config.MINIO_UPLOAD_FOLDER_NAME}/` }).single('file'),
  (req, res) => {
    store.minioClient.fPutObject(
      config.MINIO_BUCKET,
      req.file.originalname,
      req.file.path,
      { 'Content-Type': 'application/octet-stream' },
      (err) => {
        if (err) {
          return console.log(err);
        }
        return res.send(req.file);
      }
    );
  }
);

export default router;

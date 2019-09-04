import { Router } from 'express';
import Multer from 'multer';

import config from '../config/config';
import { Store, Bucket } from '../models';

const router = Router();

// Verifies if bucket already exists, otherwise create it
router.use((req, res, next) => {
  Bucket.bucketExists(config.MINIO_BUCKET, (exists) => {
    if (exists) next('route');
    else {
      Bucket.createBucket(config.MINIO_BUCKET, (success) => {
        if (success) next();
        else res.sendStatus(400);
      });
    }
  });
});

router.post(
  '/',
  Multer({ dest: `./${config.MINIO_UPLOAD_FOLDER_NAME}/` }).single('file'),
  (req, res) => {
    Store.fPutObject(
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

import { Router } from 'express';
import Multer from 'multer';

import config from '../config/config';
import { Store, Bucket } from '../models';

const router = Router();

// Verifies if bucket already exists, otherwise create it
router.use((req, res, next) => {
  Bucket.bucketExists(config.MINIO_BUCKET, (exists, err1) => {
    if (exists) next();
    else if (err1) {
      res.status(500).json({ message: err1 });
    } else {
      Bucket.createBucket(config.MINIO_BUCKET, (success, err2) => {
        if (success) next();
        else res.status(500).json({ message: err2 });
      });
    }
  });
});

router.post(
  '/',
  Multer({ dest: `./${config.MINIO_UPLOAD_FOLDER_NAME}/` }).single('file'),
  (req, res) => {
    if (req.file) {
      Store.fPutObject(
        config.MINIO_BUCKET,
        req.file.originalname,
        req.file.path,
        { 'Content-Type': 'application/octet-stream' },
        (err) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          return res.send(req.file);
        }
      );
    } else {
      res.status(400).json({ message: 'Missing file.' });
    }
  }
);

export default router;

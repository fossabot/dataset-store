import { Router } from 'express';
import Multer from 'multer';

import config from '../config/config';
import { Header, Bucket } from '../controllers';

const router = Router();

// Verifies if bucket already exists, otherwise create it
router.use(Bucket.verifyBucket);

router.get('/:uuid', Header.downloadHeader);

router.post(
  '/',
  Multer({ dest: `./${config.MINIO_UPLOAD_FOLDER_NAME}/` }).single('file'),
  Header.uploadHeader
);

export default router;

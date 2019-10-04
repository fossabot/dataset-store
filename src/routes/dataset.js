import { Router } from 'express';
import Multer from 'multer';

import config from '../config/config';
import { Dataset, Bucket } from '../controllers';

const router = Router();

// Verifies if bucket already exists, otherwise create it
router.use(Bucket.verifyBucket);

router.get('/:datasetId', Dataset.downloadDataset);

router.post(
  '/',
  Multer({ dest: `./${config.MINIO_UPLOAD_FOLDER_NAME}/` }).fields([
    { name: 'dataset', maxCount: 1 },
    { name: 'header', maxCount: 1 },
  ]),
  Dataset.handleDatasetHeader
);

export default router;

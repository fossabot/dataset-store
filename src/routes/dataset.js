import { Router } from 'express';
import Multer from 'multer';

import config from '../config/config';
import { Dataset, Bucket } from '../controllers';
import ColumnRoutes from './column';

const router = Router();

// Verifies if bucket already exists, otherwise create it
router.use(Bucket.verifyBucket);

router.use('/:datasetId/columns', ColumnRoutes);

router.get('/:datasetId', Dataset.downloadDataset);

router.post(
  '/',
  Multer({ dest: `./${config.MINIO_UPLOAD_FOLDER_NAME}/` }).single('file'),
  Dataset.uploadDataset
);

export default router;

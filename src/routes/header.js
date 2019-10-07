import { Router } from 'express';

import { Header, Bucket } from '../controllers';
import ColumnRoutes from './column';

const router = Router();

// Verifies if bucket already exists, otherwise create it
router.use(Bucket.verifyBucket);

router.use('/:headerId/columns', ColumnRoutes);

router.get('/:uuid', Header.downloadHeader);

export default router;

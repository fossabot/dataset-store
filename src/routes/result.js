import { Router } from 'express';

import { Result } from '../controllers';

const router = Router();

router.get('/:experimentId', Result.getResult);

router.get('/:experimentId/confusionMatrix', Result.getConfusionMatrix);

export default router;

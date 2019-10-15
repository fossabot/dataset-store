import { Router } from 'express';

import { Result } from '../controllers';

const router = Router();

router.get('/:experimentId/:task/:headerId', Result.getResult);

router.get('/:experimentId/plot', Result.getPlot);

router.get('/:experimentId/type', Result.getPlotType);

export default router;

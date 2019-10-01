import { Router } from 'express';

import { Column as Controller } from '../controllers';

const router = Router({ mergeParams: true });

router.get('/', Controller.getAll);

router.get('/:columnId', Controller.getById);

router.patch('/:columnId', Controller.update);

router.post('/', Controller.create);

export default router;

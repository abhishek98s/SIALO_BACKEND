import express from 'express';

import * as user_controller from './user.controller';

const router = express.Router();

router.get('/:id', user_controller.getUser);
router.get('/', user_controller.getAllUser);

export default router;

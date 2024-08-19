import express from 'express';

import * as auth_controller from './auth.controller';
import registerkSchema from './auth.schema';
import joiValidationMiddleware from '../middleware/joiValidationMiddleware';

const router = express.Router();

router.post('/register', joiValidationMiddleware(registerkSchema), auth_controller.registerHandler);
router.post('/login', auth_controller.loginHandler);

export default router;

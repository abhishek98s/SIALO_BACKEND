import express from 'express';

import * as auth_controller from './auth.controller';
import registerkSchema, { refreshTokenSchema } from './auth.schema';
import joiValidationMiddleware from '../middleware/joiValidationMiddleware';

const router = express.Router();

router.post('/register', joiValidationMiddleware(registerkSchema), auth_controller.registerHandler);
router.post('/login', auth_controller.loginHandler);
router.post('/refresh', joiValidationMiddleware(refreshTokenSchema),auth_controller.refreshTokenHandler);

export default router;

import express from 'express';

import * as auth_controller from './auth.controller';
import registerkSchema, { changePasswordSchema, refreshTokenSchema } from './auth.schema';
import joiValidationMiddleware from '../middleware/joiValidationMiddleware';
import { verifyToken } from '../middleware/authentication.middleware';

const router = express.Router();

router.post('/register', joiValidationMiddleware(registerkSchema), auth_controller.registerHandler);
router.post('/login', auth_controller.loginHandler);
router.post('/refresh', joiValidationMiddleware(refreshTokenSchema), auth_controller.refreshTokenHandler);
router.patch('/changePassword', verifyToken, joiValidationMiddleware(changePasswordSchema), auth_controller.changePassword);
export default router;

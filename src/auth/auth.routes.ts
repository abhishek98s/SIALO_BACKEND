import express from 'express';

import * as auth_controller from './auth.controller';
import { registerSchema, refreshTokenSchema, loginSchema, changePasswordSchema } from './auth.schema';

import joiValidationMiddleware from '../middleware/joiValidationMiddleware';
import { verifyToken } from '../middleware/authentication.middleware';

const router = express.Router();


router.post('/register', joiValidationMiddleware(registerSchema), auth_controller.registerHandler);
router.post('/login', joiValidationMiddleware(loginSchema), auth_controller.loginHandler);
router.post('/refresh', joiValidationMiddleware(refreshTokenSchema), auth_controller.refreshTokenHandler);
router.patch('/changePassword', verifyToken, joiValidationMiddleware(changePasswordSchema), auth_controller.changePassword);

export default router;

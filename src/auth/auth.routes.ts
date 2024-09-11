import express from 'express';

import * as auth_controller from './auth.controller';
import { registerSchema, refreshTokenSchema, loginSchema } from './auth.schema';
import joiValidationMiddleware from '../middleware/joiValidationMiddleware';

const router = express.Router();

router.post('/register', joiValidationMiddleware(registerSchema), auth_controller.registerHandler);
router.post('/login', joiValidationMiddleware(loginSchema), auth_controller.loginHandler);
router.post('/refresh', joiValidationMiddleware(refreshTokenSchema), auth_controller.refreshTokenHandler);

export default router;

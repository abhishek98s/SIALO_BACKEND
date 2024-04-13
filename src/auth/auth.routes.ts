import express from 'express';

// Controllers
import * as auth_controller from './auth.controller';
import { upload } from '../utils/multer';

const router = express.Router();

router.post('/register', upload.single('image'), auth_controller.registerHandler);
router.post('/login', auth_controller.loginHandler);

export default router;

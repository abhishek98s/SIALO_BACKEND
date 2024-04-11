import express from 'express';

import { getAllUserHandler, getUserHandler } from '../controller/Users.js';

const router = express.Router();

router.get('/user/:id', getUserHandler);
router.get('/user', getAllUserHandler);

export default router;

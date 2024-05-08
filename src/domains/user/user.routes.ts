import express from 'express';

import * as user_controller from './user.controller';
import { verifyToken } from '../../middleware/authentication.middleware';

const router = express.Router();

router.use(verifyToken);

router.get('/:id', user_controller.getUser);
router.get('/', user_controller.fetchAll);

router.patch('/friend/add/:friendId', user_controller.addFriend)
    .patch('/friend/accept/:friendId', user_controller.acceptRequest);

export default router;

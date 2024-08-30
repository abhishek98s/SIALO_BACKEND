import express from 'express';

import * as user_controller from './user.controller';
import { verifyToken } from '../../middleware/authentication.middleware';

const router = express.Router();

router.use(verifyToken);

router.get('/friendRequests', user_controller.getFriendRequests);
router.get('/search', user_controller.searchUser);
router.get('/recommendation', user_controller.fetchUnknownPeople);
router.route('/:id').get(user_controller.getUser).delete(user_controller.deleteUser);
router.get('/', user_controller.fetchAll);


router.patch('/friend/add/:friendId', user_controller.addFriend)
    .patch('/friend/accept/:friendId', user_controller.acceptRequest)
    .patch('/friend/reject/:friendId', user_controller.rejectRequest);

export default router;

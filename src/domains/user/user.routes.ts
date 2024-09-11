import express from 'express';

import * as user_controller from './user.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import joiValidationMiddleware, { joiFileValidationMiddleware } from '../../middleware/joiValidationMiddleware';
import { changeUsernameSchema, fileSchema } from './user.schema';
import { upload } from '../../utils/multer';

const router = express.Router();

router.use(verifyToken);

router.get('/friends/:userId', user_controller.getFriends);
router.get('/friendRequests', user_controller.getFriendRequests);
router.get('/search', user_controller.searchUser);
router.get('/recommendation', user_controller.fetchUnknownPeople);
router.route('/:id').get(user_controller.getUser)
    .delete(user_controller.deleteUser)
    .patch(joiValidationMiddleware(changeUsernameSchema), user_controller.updateUsername);
router.get('/', user_controller.fetchAll);

router.patch('/profilePicture', upload.single('sialo_profile_image'), joiFileValidationMiddleware(fileSchema), verifyToken, user_controller.updateProfilePicture);
router.patch('/coverPicture', upload.single('sialo_cover_image'), joiFileValidationMiddleware(fileSchema), verifyToken, user_controller.updateCoverPicture);

router.patch('/friend/add/:friendId', user_controller.addFriend)
    .patch('/friend/accept/:friendId', user_controller.acceptRequest)
    .patch('/friend/reject/:friendId', user_controller.rejectRequest);

export default router;

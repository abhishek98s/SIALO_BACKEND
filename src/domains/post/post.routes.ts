import express from 'express';

import { upload } from '../../utils/multer';

import * as post_controller from './post.controller';
import { verifyToken } from '../../middleware/authentication.middleware';

const router = express.Router();

router.use(verifyToken);

router.post('/', upload.single('sialo_image'), verifyToken, post_controller.createPost)
    .get('/', post_controller.getAllPost);

    router.get('/reqPost', post_controller.getRequestedPosts);
router.get('/:userId', post_controller.getUserPosts);

router.patch('/comment/:postId', post_controller.addComment);


export default router;

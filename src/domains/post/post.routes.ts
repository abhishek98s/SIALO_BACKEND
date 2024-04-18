import express from 'express';

import { upload } from '../../utils/multer';

import * as post_controller from './post.controller';
import { verifyToken } from '../../middleware/authentication.middleware';

const router = express.Router();

router.use(verifyToken);

router.post('/post', upload.single('sialo_image'), post_controller.createPost)
    .get('/post', post_controller.getAllPost);  // get ALl the Posts

router.get('/post/:userId', post_controller.getUserPosts);  // get posts of a specific user

router.patch('/comment/:postId', post_controller.addComment);  // add comment to a post
router.get('/reqPost/:noofItems', post_controller.getRequestedPosts);  // get posts for unlimited scrolling

export default router;

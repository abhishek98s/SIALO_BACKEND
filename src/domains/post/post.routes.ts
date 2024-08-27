import express from 'express';

import { upload } from '../../utils/multer';

import * as post_controller from './post.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import joiValidationMiddleware, { joiFileValidationMiddleware } from '../../middleware/joiValidationMiddleware';
import { postBodySchema } from './post.schema';
import { fileSchema } from '../user/user.schema';

const router = express.Router();

router.use(verifyToken);

router.patch('/like', post_controller.likeAPost);

router.post('/', upload.single('sialo_image'),
    joiFileValidationMiddleware(fileSchema),
    joiValidationMiddleware(postBodySchema),
    verifyToken, post_controller.createPost)
    .get('/', post_controller.getAllPost)
    .patch('/:id', post_controller.updateCaption);

router.get('/random', post_controller.getRandomPost);

router.get('/reqPost', post_controller.getRequestedPosts);
router.get('/:userId', post_controller.getUserPosts);

router.delete('/:id', post_controller.deletePost);

router.patch('/comment/:postId', post_controller.addComment);


export default router;

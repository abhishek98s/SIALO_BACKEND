import express from 'express';
import * as story_controller from './story.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import { upload } from '../../utils/multer';
import joiValidationMiddleware, { joiFileValidationMiddleware } from '../../middleware/joiValidationMiddleware';
import { storyPostSchema } from './story.schema';
import { fileSchema } from '../user/user.schema';

const router = express.Router();

router.use(upload.single('sialo_story_image'));
router.use(verifyToken);

router.route('/').get(story_controller.getAllStories)
    .post(joiValidationMiddleware(storyPostSchema), joiFileValidationMiddleware(fileSchema), story_controller.postStory);

router.route('/:id').get(story_controller.getStoryById).patch(joiValidationMiddleware(storyPostSchema), joiValidationMiddleware(storyPostSchema), story_controller.patchStory)
    .delete(story_controller.deleteStory);

export default router;

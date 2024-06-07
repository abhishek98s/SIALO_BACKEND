import express from 'express';
import * as story_controller from './story.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import { upload } from '../../utils/multer';

const router = express.Router();

router.use(upload.single('sialo_image'));
router.use(verifyToken);

router.route('/').get(story_controller.getAllStories)
    .post(story_controller.postStory);

router.route('/:id').patch(story_controller.patchStory)
    .delete(story_controller.deleteStory);

export default router;

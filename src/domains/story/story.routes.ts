import express from 'express';
import * as story_controller from './story.controller';
import { verifyToken } from '../../middleware/authentication.middleware';

const router = express.Router();

router.use(verifyToken);

router.route('/').get(story_controller.getAll)
.post(story_controller.postStory);

router.route('/:id').patch(story_controller.updateStory)
.delete(story_controller.deleteStory);

export default router;

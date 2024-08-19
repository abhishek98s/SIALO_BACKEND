import { Request, Response } from 'express';

import asyncWrapper from '../../utils/async';
import * as story_service from './story.service';
import { storyExceptionMessage } from './constant/storyExceptionMessage';

export const getAllStories = asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.body.user;
    const stories = await story_service.getAllStories(id);

    res.status(200).json({ status: true, data: stories });
});

export const postStory = asyncWrapper(async (req: Request, res: Response) => {
    const { caption } = req.body;
    const { id } = req.body.user;

    if (!caption) {
        throw new Error(storyExceptionMessage.CAPTION_REQUIRED);
    }

    if (!req.file) throw new Error(storyExceptionMessage.FILE_REQUIRED);

    const story_data = {
        user_id: id,
        user_name: '',
        user_image: '',
        caption,
        storyImage: req.file!.path,
    };

    const posted_story = await story_service.createStory(story_data);

    res.status(200).json({ status: true, data: posted_story });
});

export const patchStory = asyncWrapper(async (req: Request, res: Response) => {
    const { id: story_id } = req.params;
    const { id: user_id } = req.body.user;
    const { caption } = req.body;

    if (!story_id) throw new Error(storyExceptionMessage.INVALID_ID);

    if (!caption) throw new Error(storyExceptionMessage.CAPTION_REQUIRED);

    const file_path = (req.file) ? req.file.path : null;

    const updated_story = await story_service.updateStory(story_id, user_id, caption, file_path);

    res.status(200).json({ status: true, data: updated_story });
});

export const deleteStory = asyncWrapper(async (req: Request, res: Response) => {
    const { id: story_id } = req.params;
    const { id: user_id } = req.body.user;

    if (!story_id) throw new Error(storyExceptionMessage.INVALID_ID);

    await story_service.deleteStory(story_id, user_id);

    res.status(200).json({ status: true, message: storyExceptionMessage.DELETE_SUCESS });
});

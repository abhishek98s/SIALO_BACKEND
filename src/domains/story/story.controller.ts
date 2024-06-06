import { Request, Response } from 'express';

import asyncWrapper from '../../utils/async';
import * as story_service from './story.service';
import { storyExceptionMessage } from './constant/storyExceptionMessage';

export const getAllStories = asyncWrapper(async (req: Request, res: Response) => {
    const stories = await story_service.getAllStories();

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
        user: id,
        caption,
        storyImage: req.file!.path,
    };

    const posted_story = await story_service.createStory(story_data);

    res.status(200).json({ status: true, data: posted_story });
});

export const patchStory = asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { caption } = req.body;

    if (!id) throw new Error(storyExceptionMessage.INVALID_ID);

    if (!caption && !req.file) throw new Error(storyExceptionMessage.CAPTION_IMG_REQUIRED);

    const updated_story = await story_service.updateStory(caption, req.file!.path);

    res.status(200).json({ status: true, data: updated_story });
});

export const deleteStory = asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) throw new Error(storyExceptionMessage.INVALID_ID);

    await story_service.deleteStory(id);

    res.status(200).json({ status: true, message: storyExceptionMessage.DELETE_SUCESS });
});

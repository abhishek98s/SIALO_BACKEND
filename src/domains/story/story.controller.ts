/** @format */

import { Request, Response } from 'express';

import asyncWrapper from '../../utils/async';
import * as story_service from './story.service';
import { storyExceptionMessage } from './constant/storyExceptionMessage';
import { StatusCodes } from 'http-status-codes';
import { customHttpError } from '../../utils/customHttpError';

export const getAllStories = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id } = req.body.user;
    const stories = await story_service.getAllStories(id);

    res.status(StatusCodes.OK).json({ status: true, data: stories });
  },
);

export const postStory = asyncWrapper(async (req: Request, res: Response) => {
  const { caption } = req.body;
  const { id } = req.body.user;

  if (!caption) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      storyExceptionMessage.CAPTION_REQUIRED,
    );
  }

  if (!req.file)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      storyExceptionMessage.FILE_REQUIRED,
    );

  const story_data = {
    user_id: id,
    user_name: '',
    user_image: '',
    caption,
    story_image: req.file!.path,
  };

  const posted_story = await story_service.createStory(story_data);

  res.status(StatusCodes.OK).json({ status: true, data: posted_story });
});

export const getStoryById = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: user_id } = req.params;

    const result = await story_service.getStoryById(user_id);

    res.status(StatusCodes.OK).json({ status: true, data: result });
  },
);

export const patchStory = asyncWrapper(async (req: Request, res: Response) => {
  const { id: story_id } = req.params;
  const { id: user_id } = req.body.user;
  const { caption } = req.body;

  if (!story_id)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      storyExceptionMessage.INVALID_ID,
    );

  if (!caption)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      storyExceptionMessage.CAPTION_REQUIRED,
    );

  const file_path = req.file ? req.file.path : null;

  const updated_story = await story_service.updateStory(
    story_id,
    user_id,
    caption,
    file_path,
  );

  res.status(StatusCodes.OK).json({ status: true, data: updated_story });
});

export const deleteStory = asyncWrapper(async (req: Request, res: Response) => {
  const { id: story_id } = req.params;
  const { id: user_id } = req.body.user;

  if (!story_id)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      storyExceptionMessage.INVALID_ID,
    );

  await story_service.deleteStory(story_id, user_id);

  res
    .status(StatusCodes.OK)
    .json({ status: true, message: storyExceptionMessage.DELETE_SUCESS });
});

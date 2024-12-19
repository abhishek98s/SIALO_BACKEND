/** @format */

import { Request, Response } from 'express';

import asyncWrapper from '../../utils/async';
import * as post_service from './post.service';
import { postExceptionMessage } from './constant/postExceptionMessage';
import { StatusCodes } from 'http-status-codes';
import { customHttpError } from '../../utils/customHttpError';

export const getAllPost = asyncWrapper(async (req: Request, res: Response) => {
  const posts = await post_service.getAllPost();

  res.status(StatusCodes.OK).json({ status: true, data: posts });
});

export const getUserPosts = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const userPosts = await post_service.getUserPosts(userId);

    res.status(StatusCodes.OK).json({ status: true, data: userPosts });
  },
);

export const createPost = asyncWrapper(async (req: Request, res: Response) => {
  const { caption } = req.body;
  const { id, name, image } = req.body.user;

  if (!caption) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      postExceptionMessage.CAPTION_REQUIRED,
    );
  }

  if (!req.file)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      postExceptionMessage.FILE_REQUIRED,
    );

  const post_image = req.file!.path;

  const userPost = await post_service.createPost(
    { name, userId: id, caption, post_image, user_image: image },
    post_image,
  );

  res.status(201).json({ status: true, data: userPost });
});

export const addComment = asyncWrapper(async (req: Request, res: Response) => {
  const { comment } = req.body;
  const { name, image, id } = req.body.user;

  const { postId } = req.params;

  if (!comment)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      postExceptionMessage.NAME_COMMENT_REQUIRED,
    );

  const comment_info = {
    user_id: id,
    comment,
    comment_user_name: name,
    comment_user_picture: image,
  };

  await post_service.addPostComments(postId, comment_info);

  res
    .status(StatusCodes.OK)
    .json({ status: true, message: postExceptionMessage.COMMENT_SUCESS });
});

export const getRequestedPosts = asyncWrapper(
  async (req: Request, res: Response) => {
    const page = req.query.page as unknown as number;

    const posts = await post_service.getRequestedPosts(page);

    res.status(StatusCodes.OK).json({ status: true, data: posts });
  },
);

export const getRandomPost = asyncWrapper(
  async (req: Request, res: Response) => {
    const noOfPosts = (req.query.noOfPosts as unknown as number) || 5;

    const { id: user_id } = req.body.user;

    const posts = await post_service.getRandomPost(noOfPosts, user_id);

    res.status(StatusCodes.OK).json({ status: true, data: posts });
  },
);

export const getRandomPostOFUser = asyncWrapper(
  async (req: Request, res: Response) => {
    const noOfPosts = (req.query.noOfPosts as unknown as number) || 4;
    const { userId } = req.params;

    const posts = await post_service.getRandomPostOfUser(noOfPosts, userId);

    res.status(StatusCodes.OK).json({ status: true, data: posts });
  },
);

export const likeAPost = asyncWrapper(async (req: Request, res: Response) => {
  const { id: user_id } = req.body.user;
  const post_id = req.query.postId as unknown as string;

  if (!user_id || !post_id)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      postExceptionMessage.INVALID_ID,
    );

  const isPostLiked = await post_service.toggleLikeIn(post_id, user_id);

  const { isLiked, totalLike } = isPostLiked;

  let message = '';
  let liked;
  if (isLiked) {
    message = postExceptionMessage.LIKE_SUCCESS;
    liked = true;
  } else {
    message = postExceptionMessage.UNLIKE_SUCCESS;
    liked = false;
  }

  res
    .status(StatusCodes.OK)
    .json({ status: true, liked, totalLike, message: message });
});

export const deletePost = asyncWrapper(async (req: Request, res: Response) => {
  const post_id = req.params.id as unknown as string;

  if (!post_id)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      postExceptionMessage.INVALID_ID,
    );

  await post_service.deletePost(post_id);

  res
    .status(StatusCodes.OK)
    .json({ status: true, message: 'Post deleted sucessfully.' });
});

export const updateCaption = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: user_id } = req.body.user;
    const post_id = req.params.id as unknown as string;
    const { caption } = req.body;

    if (!post_id)
      throw new customHttpError(
        StatusCodes.BAD_REQUEST,
        postExceptionMessage.INVALID_ID,
      );
    if (!caption)
      throw new customHttpError(
        StatusCodes.BAD_REQUEST,
        postExceptionMessage.CAPTION_REQUIRED,
      );

    const updatedPost = await post_service.updateCaption(
      user_id,
      post_id,
      caption,
    );

    res.status(StatusCodes.OK).json({ status: true, data: updatedPost });
  },
);

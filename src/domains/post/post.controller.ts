import { Request, Response } from 'express';

import asyncWrapper from '../../utils/async';
import * as post_service from './post.service';
import { postExceptionMessage } from './constant/postExceptionMessage';


export const getAllPost = asyncWrapper(async (req: Request, res: Response) => {
    const posts = await post_service.getAllPost();

    res.status(200).json({ data: posts });
});

export const getUserPosts = asyncWrapper(async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const userPosts = await post_service.getUserPosts(userId);

    res.status(200).json({ data: userPosts });
});

export const createPost = asyncWrapper(async (req: Request, res: Response) => {
    const { userId, name, userPicturePath, caption } = req.body;

    if (!name || !caption) {
        throw new Error(postExceptionMessage.FIELD_EMPTY);
    }

    const post_image = req.file!.path;

    const userPost = await post_service.createPost({ userId, name, userPicturePath, caption }, post_image);

    res.status(200).json({ data: userPost });
});

export const addComment = asyncWrapper(async (req: Request, res: Response) => {
    const { name, comment, userId, userPicturePath } = req.body;
    const { postId } = req.params;

    if (!name || !comment) throw new Error(postExceptionMessage.NAME_COMMENT_REQUIRED);

    const post = await post_service.addPostComments(postId, { name, comment, userId, userPicturePath });

    res.status(200).json({ data: post });
});

export const getRequestedPosts = asyncWrapper(async (req: Request, res: Response) => {
    const no_of_posts = req.query.posts as unknown as number;

    const posts = await post_service.getRequestedPosts(no_of_posts);

    res.status(200).json({ data: posts });
});

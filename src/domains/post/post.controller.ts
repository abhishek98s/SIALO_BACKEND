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
    const { caption } = req.body;
    const { id, name } = req.body.user;

    if (!caption) {
        throw new Error(postExceptionMessage.CAPTION_REQUIRED);
    }

    if (!req.file) throw new Error(postExceptionMessage.FILE_REQUIRED);

    const post_image = req.file!.path;

    const userPost = await post_service.createPost({ name, userId: id, caption, post_image }, post_image);

    res.status(200).json({ data: userPost });
});


export const addComment = asyncWrapper(async (req: Request, res: Response) => {
    const { comment } = req.body;
    const { name, image } = req.body.user;

    const { postId } = req.params;

    if (!comment) throw new Error(postExceptionMessage.NAME_COMMENT_REQUIRED);

    const comment_info = {
        comment,
        comment_user_name: name,
        comment_user_picture: image,
    };

    const post = await post_service.addPostComments(postId, comment_info);

    res.status(200).json({ data: post });
});


export const getRequestedPosts = asyncWrapper(async (req: Request, res: Response) => {
    const no_of_posts = req.query.no_of_posts as unknown as number;

    const posts = await post_service.getRequestedPosts(no_of_posts);

    res.status(200).json({ data: posts });
});

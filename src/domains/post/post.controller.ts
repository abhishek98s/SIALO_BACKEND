import { Request, Response } from 'express';

import asyncWrapper from '../../utils/async';
import * as post_service from './post.service';
import { postExceptionMessage } from './constant/postExceptionMessage';


export const getAllPost = asyncWrapper(async (req: Request, res: Response) => {
    const posts = await post_service.getAllPost();

    res.status(200).json({ status: true, data: posts });
});


export const getUserPosts = asyncWrapper(async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const userPosts = await post_service.getUserPosts(userId);

    res.status(200).json({ status: true, data: userPosts });
});


export const createPost = asyncWrapper(async (req: Request, res: Response) => {
    const { caption } = req.body;
    const { id, name, image } = req.body.user;

    if (!caption) {
        throw new Error(postExceptionMessage.CAPTION_REQUIRED);
    }

    if (!req.file) throw new Error(postExceptionMessage.FILE_REQUIRED);

    const post_image = req.file!.path;

    const userPost = await post_service.createPost({ name, userId: id, caption, post_image, user_image: image }, post_image);

    res.status(200).json({ status: true, data: userPost });
});


export const addComment = asyncWrapper(async (req: Request, res: Response) => {
    const { comment } = req.body;
    const { name, image, id } = req.body.user;

    const { postId } = req.params;

    if (!comment) throw new Error(postExceptionMessage.NAME_COMMENT_REQUIRED);

    const comment_info = {
        user_id: id,
        comment,
        comment_user_name: name,
        comment_user_picture: image,
    };

    const post = await post_service.addPostComments(postId, comment_info);

    res.status(200).json({ status: true, data: post });
});


export const getRequestedPosts = asyncWrapper(async (req: Request, res: Response) => {
    const page = req.query.page as unknown as number;

    const posts = await post_service.getRequestedPosts(page);

    res.status(200).json({ status: true, data: posts });
});

export const getRandomPost = asyncWrapper(async (req: Request, res: Response) => {
    const noOfPosts = req.query.noOfPosts as unknown as number || 5;

    const posts = await post_service.getRandomPost(noOfPosts);

    res.status(200).json({ status: true, data: posts });
});

export const likeAPost = asyncWrapper(async (req: Request, res: Response) => {
    const { id: user_id } = req.body.user;
    const post_id = req.query.postId as unknown as string;

    if (!user_id || !post_id) throw new Error(postExceptionMessage.INVALID_ID);

    const isPostLiked = await post_service.toggleLikeIn(post_id, user_id);

    let message = '';
    if (isPostLiked) {
        message = postExceptionMessage.LIKE_SUCCESS;
    } else {
        message = postExceptionMessage.UNLIKE_SUCCESS;
    }

    res.status(200).json({ status: true, message: message });
});

export const deletePost = asyncWrapper(async (req: Request, res: Response) => {
    const post_id = req.params.id as unknown as string;

    if (!post_id) throw new Error(postExceptionMessage.INVALID_ID);

    await post_service.deletePost(post_id);

    res.status(200).json({ status: true, message: 'Post deleted sucessfully.' });
});

export const updateCaption = asyncWrapper(async (req: Request, res: Response) => {
    const { id: user_id } = req.body.user;
    const post_id = req.params.id as unknown as string;
    const { caption } = req.body;

    if (!post_id) throw new Error(postExceptionMessage.INVALID_ID);
    if (!caption) throw new Error(postExceptionMessage.CAPTION_REQUIRED);

    const updatedPost = await post_service.updateCaption(user_id, post_id, caption);

    res.status(200).json({ status: true, data: updatedPost });
});

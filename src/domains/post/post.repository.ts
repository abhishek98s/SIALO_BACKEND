/** @format */

import { toNumber } from 'lodash';

import { postExceptionMessage } from './constant/postExceptionMessage';
import Post, { IComment, IPost } from './post.model';
import { customHttpError } from '../../utils/customHttpError';
import { StatusCodes } from 'http-status-codes';

export const fetchAll = async () => {
  return await Post.find({}).select([
    '_id',
    'name',
    'userId',
    'user_image',
    'caption',
    'post_image',
    'comments',
    'likes',
    'createdAt',
  ]);
};

export const fetchById = async (
  post_id: string,
): Promise<
  {
    _id: string;
    name: string;
    userId: string;
    caption: string;
    post_image: string;
    comments: IComment[];
    likes: string[];
  }[]
> => {
  return await Post.find({ _id: post_id }).select([
    '_id',
    'name',
    'userId',
    'caption',
    'post_image',
    'comments',
    'likes',
  ]);
};

export const fetchPostsUpTo = async (no_of_posts: number) => {
  return await Post.find({})
    .limit(no_of_posts)
    .select([
      '_id',
      'name',
      'userId',
      'caption',
      'post_image',
      'comments',
      'likes',
      'createdAt',
      'user_image',
    ]);
};

export const create = async (post_details: IPost) => {
  console.log(post_details);
  const post = new Post({ ...post_details });

  if (!post)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      postExceptionMessage.POST_FALIED,
    );

  const returned_post = await post.save();

  const {
    name,
    userId,
    caption,
    post_image,
    likes,
    comments,
    user_image,
    _id,
  } = returned_post;
  return {
    _id,
    userId,
    user_image,
    name,
    caption,
    post_image,
    likes,
    comments,
  };
};

export const fetchByUserId = async (user_id: string) => {
  return await Post.find({ userId: user_id }).select([
    '_id',
    'name',
    'userId',
    'caption',
    'post_image',
    'comments',
    'likes',
    'createdAt',
    'user_image',
  ]);
};

export const fetchRandomPostsUpTo = async (no_of_post: number) => {
  const noOfPost = toNumber(no_of_post);

  return await Post.aggregate([
    { $sample: { size: noOfPost } },
    {
      $project: {
        _id: 1,
        name: 1,
        userId: 1,
        caption: 1,
        post_image: 1,
        comments: 1,
        likes: 1,
        createdAt: 1,
        user_image: 1,
      },
    },
  ]);
};

export const fetchRandomPostsOfUserUpTo = async (
  no_of_post: number,
  user_id: string,
) => {
  const noOfPost = toNumber(no_of_post);

  return await Post.aggregate([
    { $match: { userId: user_id } },
    { $sample: { size: noOfPost } },
    {
      $project: {
        _id: 1,
        name: 1,
        userId: 1,
        caption: 1,
        post_image: 1,
        comments: 1,
        likes: 1,
        createdAt: 1,
        user_image: 1,
      },
    },
  ]);
};

export const addCommentById = async (
  post_id: string,
  commentData: IComment,
) => {
  const updatedPost = await Post.findOneAndUpdate(
    { _id: post_id },
    { $push: { comments: { ...commentData } } },
    { new: true, select: ['comments'] },
  );

  const lastComment = updatedPost?.comments[updatedPost.comments.length - 1];
  return { _id: post_id, lastComment };
};

export const isPostLiked = async (post_id: string, user_id: string) => {
  const isLiked = await Post.find({ _id: post_id, likes: { $in: [user_id] } });
  return isLiked.length !== 0 ? 1 : 0;
};

export const addLike = async (post_id: string, user_id: string) => {
  return await Post.updateOne({ _id: post_id }, { $push: { likes: user_id } });
};

export const removeLike = async (post_id: string, user_id: string) => {
  return await Post.updateOne({ _id: post_id }, { $pull: { likes: user_id } });
};

export const removePostById = async (post_id: string) => {
  return await Post.deleteOne({ _id: post_id });
};

export const removePostsByuserId = async (user_id: string) => {
  return await Post.deleteMany({ userId: user_id });
};

export const updateCaption = async (post_id: string, caption: string) => {
  return await Post.findOneAndUpdate(
    { _id: post_id },
    { caption: caption },
    { new: true },
  ).select(['caption']);
};

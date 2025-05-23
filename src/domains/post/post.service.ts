import { uploadToCloudinary } from '../../utils/cloudinary';
import { IComment, IPost } from './post.model';

import * as PostDAO from './post.repository';
import * as UserDAO from '../user/user.repository';
import { userExceptionMessage } from '../user/constant/userExceptionMessage';
import { postExceptionMessage } from './constant/postExceptionMessage';
import { convertDateTime } from '../../utils/date';
import { StatusCodes } from 'http-status-codes';
import { customHttpError } from '../../utils/customHttpError';

export const getAllPost = async () => {
  const posts = await PostDAO.fetchAll();
  return posts.map((post) => ({
    id: post._id,
    userId: post.userId,
    name: post.name,
    user_image: post.user_image,
    caption: post.caption,
    createdAt: convertDateTime(post.createdAt.toString()),
    post_image: post.post_image,
    likes: post.likes,
    comments: post.comments,
  }));
};

export const getUserPosts = async (user_id: string) => {
  const user = await UserDAO.fetchById(user_id);
  if (!user)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      userExceptionMessage.USER_NOT_FOUND,
    );

  const user_posts = await PostDAO.fetchByUserId(user_id);
  if (!user_posts) throw Error(postExceptionMessage.POST_UNAVAIABLE);

  return user_posts.map((post) => ({
    id: post._id,
    userId: post.userId,
    name: post.name,
    user_image: post.user_image,
    caption: post.caption,
    createdAt: convertDateTime(post.createdAt.toString()),
    post_image: post.post_image,
    likes: post.likes,
    comments: post.comments,
  }));
};

export const createPost = async (postDetails: IPost, image_path: string) => {
  const img_url = await uploadToCloudinary(image_path);

  const user = await UserDAO.fetchById(postDetails.userId);

  const new_post: IPost = {
    ...postDetails,
    post_image: img_url,
    user_image: user.img?.toString(),
  };

  return await PostDAO.create(new_post);
};

export const addPostComments = async (
  post_id: string,
  comment_data: IComment,
) => {
  const post = await PostDAO.fetchById(post_id);

  if (post.length === 0)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      postExceptionMessage.NOT_FOUND,
    );

  return await PostDAO.addCommentById(post_id, comment_data);
};

export const getRequestedPosts = async (noofItems: number) => {
  const itemsToRequest = 5;
  const resultLength = noofItems * itemsToRequest;

  const result = await PostDAO.fetchPostsUpTo(resultLength);

  const availableItems = result.splice(resultLength - 5);
  return availableItems;
};

export const getRandomPost = async (noofPosts: number, user_id: string) => {
  const postToRequest = noofPosts;

  const result = await PostDAO.fetchRandomPostsUpTo(postToRequest);

  return result.map((post) => ({
    id: post._id,
    userId: post.userId,
    name: post.name,
    user_image: post.user_image,
    caption: post.caption,
    createdAt: convertDateTime(post.createdAt.toString()),
    post_image: post.post_image,
    likes: post.likes.length,
    isLiked: post.likes.includes(user_id),
    comments: post.comments,
  }));
};

export const getRandomPostOfUser = async (
  noofPosts: number,
  user_id: string,
) => {
  const postToRequest = noofPosts;
  const result = await PostDAO.fetchRandomPostsOfUserUpTo(
    postToRequest,
    user_id,
  );

  return result.map((post) => ({
    id: post._id,
    userId: post.userId,
    name: post.name,
    user_image: post.user_image,
    caption: post.caption,
    createdAt: convertDateTime(post.createdAt.toString()),
    post_image: post.post_image,
    likes: post.likes.length,
    isLiked: post.likes.includes(user_id),
    comments: post.comments,
  }));
};

export const toggleLikeIn = async (post_id: string, user_id: string) => {
  const isPostAvailable = await PostDAO.fetchById(post_id);

  if (isPostAvailable.length === 0)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      postExceptionMessage.NOT_FOUND,
    );

  const isLiked = await PostDAO.isPostLiked(post_id, user_id);

  const totalLike = await isPostAvailable[0].likes.length;

  if (!isLiked) {
    await PostDAO.addLike(post_id, user_id);
    return { isLiked: true, totalLike };
  } else {
    await PostDAO.removeLike(post_id, user_id);
    return { isLiked: false, totalLike };
  }
};

export const deletePost = async (post_id: string) => {
  const isPostAvailable = await PostDAO.fetchById(post_id);

  if (isPostAvailable.length === 0)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      postExceptionMessage.NOT_FOUND,
    );

  const deleted_post = await PostDAO.removePostById(post_id);

  if (!deleted_post)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      postExceptionMessage.DELETE_FAILED,
    );

  return isPostAvailable[0];
};

export const updateCaption = async (
  user_id: string,
  post_id: string,
  caption: string,
) => {
  const isPostAvailable = await PostDAO.fetchById(post_id);

  if (isPostAvailable.length === 0)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      postExceptionMessage.NOT_FOUND,
    );

  if (isPostAvailable[0].userId !== user_id)
    throw new customHttpError(
      StatusCodes.FORBIDDEN,
      postExceptionMessage.PERMISSION_DENIED,
    );

  return await PostDAO.updateCaption(post_id, caption);
};

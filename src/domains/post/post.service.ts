import { uploadToCloudinary } from '../../utils/cloudinary';
import { IComment, IPost } from './post.model';

import * as PostDAO from './post.repository';
import * as UserDAO from '../user/user.repository';
import { userExceptionMessage } from '../user/constant/userExceptionMessage';
import { postExceptionMessage } from './constant/postExceptionMessage';
import { convertDateTime } from '../../utils/date';

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
    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const user_posts = await PostDAO.fetchByUserId(user_id);
    if (!user_posts) throw Error(postExceptionMessage.POST_UNAVAIABLE);

    return user_posts.map((post) => ({
        ...post,
        createdAt: convertDateTime(post.createdAt.toString()),
    }));
};

export const createPost = async (postDetails: IPost, image_path: string) => {
    const img_url = await uploadToCloudinary(image_path);

    const new_post = {
        ...postDetails,
        post_image: img_url,
    };

    return await PostDAO.create(new_post);
};

export const addPostComments = async (post_id: string, comment_data: IComment) => {
    const post = await PostDAO.fetchById(post_id);
    if (!post) throw new Error(postExceptionMessage.POST_UNAVAIABLE);

    return await PostDAO.addCommentById(post_id, comment_data);
};

export const getRequestedPosts = async (noofItems: number) => {
    const itemsToRequest = 5;
    const resultLength = noofItems * itemsToRequest;

    const result = await PostDAO.fetchPostsUpTo(resultLength);

    const availableItems = result.splice(resultLength - 5);
    return availableItems;
};

export const getRandomPost = async (noofPosts: number) => {
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
        comments: post.comments,
    }));
};

export const toggleLikeIn = async (post_id: string, user_id: string) => {
    const isPostAvailable = await PostDAO.fetchById(post_id);

    if (isPostAvailable.length === 0) throw new Error(postExceptionMessage.NOT_AVAILABLE);

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

    if (isPostAvailable.length === 0) throw new Error(postExceptionMessage.NOT_AVAILABLE);

    const deleted_post = await PostDAO.removePostById(post_id);

    if (!deleted_post) throw new Error(postExceptionMessage.DELETE_FAILED);

    return isPostAvailable[0];
};


export const updateCaption = async (user_id: string, post_id: string, caption: string) => {
    const isPostAvailable = await PostDAO.fetchById(post_id);

    if (isPostAvailable.length === 0) throw new Error(postExceptionMessage.NOT_AVAILABLE);

    if (isPostAvailable[0].userId !== user_id) throw new Error(postExceptionMessage.PERMISSION_DENIED);

    return await PostDAO.updateCaption(post_id, caption);
};

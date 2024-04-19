import { uploadToCloudinary } from '../../utils/cloudinary';
import { IComment, IPost } from './post.model';

import * as PostDAO from './post.repository';
import * as UserDAO from '../user/user.repository';
import { userExceptionMessage } from '../user/constant/userExceptionMessage';
import { postExceptionMessage } from './constant/postExceptionMessage';

export const getAllPost = async () => {
    const posts = await PostDAO.fetchAll();

    if (posts.length === 0) throw new Error(postExceptionMessage.POST_UNAVAIABLE);

    return posts;
};

export const getUserPosts = async (user_id: string) => {
    const user = await UserDAO.fetchById(user_id);
    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const user_posts = await PostDAO.fetchByUserId(user_id);
    if (!user_posts) throw Error(postExceptionMessage.POST_UNAVAIABLE);

    return user_posts;
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

    const availableItems = result.splice(resultLength-5);
    return availableItems;
};

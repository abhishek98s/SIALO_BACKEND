import { uploadToCloudinary } from '../../utils/cloudinary';
import Post, { IComment, IPost } from './post.model';

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
        img: img_url,
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
    const result = await Post.find({}).limit(noofItems * itemsToRequest);

    const resultLength = noofItems * itemsToRequest;
    const requestItem = result.length;
    const itemLeft = resultLength - requestItem;

    if (!result) throw Error('Something wrong');

    if ((resultLength !== requestItem) && (itemLeft > itemsToRequest)) {
        return [];
    }

    return result.slice(-5);
};

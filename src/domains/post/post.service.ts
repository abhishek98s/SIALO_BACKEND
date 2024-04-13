import cloudinary from '../../utils/cloudinary';
import Post from './post.model';
import sharp from 'sharp';

import * as PostDAO from './post.repository';
import * as UserDAO from '../user/user.repository';
import { userExceptionMessage } from '../user/constant/userExceptionMessage';
import { postExceptionMessage } from './constant/postExceptionMessage';


export const getAllPost = async () => {
    const posts = await PostDAO.fetchAll();

    return posts;
};

export const getUserPosts = async (user_id: string) => {
    const user = await UserDAO.fetchById(user_id);
    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const user_posts = await PostDAO.fetchByUserId(user_id);
    if (!user_posts) throw Error(postExceptionMessage.POST_UNAVAIABLE);

    return user_posts;
};

export const createPost = async (postDetails, imagePath) => {
    const {
        userId,
        name,
        userPicturePath,
        caption,
    } = postDetails;

    //Compres the image
    const compressedImagePath = imagePath + '.compressed.jpg';
    await sharp(imagePath).jpeg({ quality: 80 }).toFile(compressedImagePath);

    const imgUrl = await cloudinary.v2.uploader.upload(compressedImagePath, {
        resource_type: 'image',
        folder: 'Sialo',
    });

    const post = {
        userId,
        name,
        userPicturePath,
        caption,
        img: imgUrl.secure_url,
    };

    const userPost = await PostDAO.create({
        userId,
        name,
        userPicturePath,
        caption,
        img: imgUrl.secure_url,
    });

    return userPost;
};

export const addPostComments = async (postId, commentInfo) => {

    const {
        userId,
        firstName,
        lastName,
        userPicturePath,
        comment,
    } = commentInfo;

    const upadatedPost = await Post.findOneAndUpdate(
        { _id: postId.userId },
        {
            $push: {
                comments: {
                    userId,
                    firstName,
                    lastName,
                    userImg: userPicturePath,
                    comment,
                },
            },
        },
        { new: true },
    );

    return upadatedPost;
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

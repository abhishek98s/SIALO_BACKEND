import mongoose from 'mongoose';

interface IComment {
    caption: string,
    comment_user_name: string,
    comment_user_picture: string,
}

export interface IPost {
    userId: string,
    name: string,
    userPicturePath: string,
    caption: string,
    img: string,
    likes?: string,
    comments?: IComment[],
}

export const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        userPicturePath: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        img: {
            type: String,
        },
        likes: {
            type: Number,
        },
        comments: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

const Post = mongoose.model('Post', postSchema);

export default Post;

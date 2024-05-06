import mongoose from 'mongoose';

export interface IComment {
    comment: string,
    comment_user_name: string,
    comment_user_picture: string,
}

export interface IPost {
    userId: string,
    name: string,
    caption: string,
    post_image: string,
    likes?: string,
    comments?: IComment[],
}

export const postSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        post_image: {
            type: String,
        },
        likes: {
            type: Array,
            default: [],
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

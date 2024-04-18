import mongoose from 'mongoose';

export interface IComment {
    comment: string,
    comment_user_name: string,
    comment_user_picture: string,
}

export interface IPost {
    userId: string,
    caption: string,
    post_image: string,
    likes?: string,
    comments?: IComment[],
}

export const postSchema = new mongoose.Schema(
    {
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

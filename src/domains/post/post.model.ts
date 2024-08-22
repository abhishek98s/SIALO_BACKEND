import mongoose from 'mongoose';

export interface IComment {
    user_id: string,
    comment: string,
    comment_user_name: string,
    comment_user_picture: string,
}

export interface IPost {
    userId: string,
    user_image: string,
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
        user_image: {
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



// {
//     "status": true,
//         "data": [
//             {
//                 "_id": "66c70ca223989c6071ad8e3e",
//                 "name": "Abhishek Shakya",
//                 "userId": "644a45c59f66a069d05517e2",
//                 "caption": "Initial",
//                 "post_image": "https://res.cloudinary.com/dxsqdqnoe/image/upload/v1724320928/Sialo/uvyefhv4h8pr12fvxwzl.jpg",
//                 "likes": [],
//                 "comments": []
//             }
//         ]
// }

// {
//     "status": true,
//         "data": {
//         "_id": "66c70ca223989c6071ad8e3e",
//             "lastComment": {
//             "user_id": "644a45c59f66a069d05517e2",
//                 "comment": "Initial coment",
//                     "comment_user_name": "Abhishek Shakya",
//                         "comment_user_picture": "https://res.cloudinary.com/dxsqdqnoe/image/upload/v1682589124/jj5vlzpjazxnaoafoz91.png"
//         }
//     }
// }
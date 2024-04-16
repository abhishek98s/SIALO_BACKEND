import { postExceptionMessage } from './constant/postExceptionMessage';
import Post, { IComment, IPost } from './post.model';


export const fetchAll = async () => {
    return await Post.find({});
};

export const fetchById = async (post_id: string) => {
    return await Post.find({ _id: post_id });
};

export const create = async (post_details: IPost) => {
    const post = new Post({ ...post_details });

    if (!post) throw new Error(postExceptionMessage.POST_FALIED);

    return await post.save();
};

export const fetchByUserId = async (user_id: string) => {
    return await Post.find({ userId: user_id });
};

export const addCommentById = async (post_id: string, commentData: IComment) => {
    const upadated_post = await Post.findOneAndUpdate(
        { _id: post_id },
        {
            $push: {
                comments: { ...commentData },
            },
        },
        { new: true },
    );

    return upadated_post;
};

import Post, { IPost } from './post.model';

export const fetchAll = async () => {
    return await Post.find({});
};

export const create = async (post_details: IPost) => {
    const post = new Post({ ...post_details });

    return await post.save();
};

export const fetchByUserId = async (user_id: string) => {
    return await Post.find({ userId: user_id });
};

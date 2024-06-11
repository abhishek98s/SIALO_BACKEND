import { postExceptionMessage } from './constant/postExceptionMessage';
import Post, { IComment, IPost } from './post.model';


export const fetchAll = async () => {
    return await Post.find({}).select(['_id', 'name', 'userId', 'caption', 'post_image', 'comments', 'likes']);
};

export const fetchById = async (post_id: string) => {
    return await Post.find({ _id: post_id }).select(['_id', 'name', 'userId', 'caption', 'post_image', 'comments', 'likes']);
};

export const fetchPostsUpTo = async (no_of_posts: number) => {
    return await Post.find({}).limit(no_of_posts).select(['_id', 'name', 'userId', 'caption', 'post_image', 'comments', 'likes']);
};

export const create = async (post_details: IPost) => {
    const post = new Post({ ...post_details });

    if (!post) throw new Error(postExceptionMessage.POST_FALIED);

    const returned_post = await post.save();

    const { name, userId, caption, post_image, likes, comments, _id } = returned_post;
    return { name, userId, caption, post_image, likes, comments, _id };
};

export const fetchByUserId = async (user_id: string) => {
    return await Post.find({ userId: user_id }).select(['_id', 'name', 'userId', 'caption', 'post_image', 'comments', 'likes']);
};

export const addCommentById = async (post_id: string, commentData: IComment) => {
    const updatedPost = await Post.findOneAndUpdate(
        { _id: post_id },
        { $push: { comments: { ...commentData } } },
        { new: true, select: ['comments'] },
    );

    const lastComment = updatedPost?.comments[updatedPost.comments.length - 1];
    return { _id: post_id, lastComment }
};

export const isPostLiked = async (post_id: string, user_id: string) => {
    const isLiked = await Post.find({ _id: post_id, likes: { $in: [user_id] } });
    return (isLiked.length !== 0) ? 1 : 0;
};

export const addLike = async (post_id: string, user_id: string) => {
    return await Post.updateOne(
        { _id: post_id },
        { $push: { likes: user_id } },
    );
};

export const removeLike = async (post_id: string, user_id: string) => {
    return await Post.updateOne(
        { _id: post_id },
        { $pull: { likes: user_id } },
    );
};

export const removePostById = async (post_id: string) => {
    return await Post.deleteOne({ _id: post_id });
};

export const removePostsByuserId = async (user_id: string) => {
    return await Post.deleteMany({ userId: user_id });
};

export const updateCaption = async (post_id: string, caption: string) => {
    return await Post.findOneAndUpdate({ _id: post_id }, { caption: caption }, { new: true }).select(['caption']);
};

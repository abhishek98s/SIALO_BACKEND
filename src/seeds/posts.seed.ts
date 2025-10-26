import Post, { IPost } from '../domains/post/post.model';
import { IFetchUser } from '../utils/populate';
import { imageSeed } from './image.seed';

export const postSeed = async (users: IFetchUser[]): Promise<IPost[]> => {
  const posts = [];
  await Post.deleteMany({});
  for (let i = 0; i < 3; i++) {
    const user = users[i];

    const com = {
      user_id: user._id.toString(),
      comment: `Comment by ${user.name}`,
      comment_user_name: user.name || '',
      comment_user_picture: user.img || '',
    };

    const likesCount = Math.floor(Math.random() * Math.min(3, users.length));
    const likes: string[] = [];
    const likedUserIds = new Set<string>();

    while (likedUserIds.size < likesCount) {
      const randomLikeIndex = Math.floor(Math.random() * users.length);
      likedUserIds.add(users[randomLikeIndex]._id.toString());
    }

    likes.push(...likedUserIds);

    posts.push({
      user_image: user.img as string,
      name: user.name as string,
      userId: user._id.toString(),
      caption: `This is a sample post caption for ${user.name}.`,
      post_image: imageSeed[i],
      likes: [],
      comments: [com],
    });
  }
  return posts;
};

// let seedPosts: IPost[] = [];

// (async () => {
//   seedPosts = await postSeed();
// })();

// export { seedPosts };

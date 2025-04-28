import { IPost } from '../domains/post/post.model';
import { IFetchUser } from '../utils/populate';

export const postSeed = async (users: IFetchUser[]): Promise<IPost[]> => {
  const posts = [];

  for (let i = 0; i < 5; i++) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const user = users[randomUserIndex];

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
      post_image: `https://example.com/images/post${i + 1}.jpg`,
      likes: likes,
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

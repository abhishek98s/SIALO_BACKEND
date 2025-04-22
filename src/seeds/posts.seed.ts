import Post from '../domains/post/post.model';
import { User } from '../domains/user/user.model';

const postSeed = async () => {

  const users = await User.find({});
  if (users.length === 0) {
    console.log('No users found. Please seed users first.');
    return;
  }

  const posts = [];

  for (let i = 0; i < 5; i++) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const user = users[randomUserIndex];

    const com = {
      user_id: user._id,
      comment: `Comment by ${user.name}`,
      comment_user_name: user.name,
      comment_user_picture: user.img,
    };

    const likesCount = Math.floor(Math.random() * Math.min(3, users.length));
    const likes = [];
    const likedUserIds = new Set();

    while (likedUserIds.size < likesCount) {
      const randomLikeIndex = Math.floor(Math.random() * users.length);
      likedUserIds.add(users[randomLikeIndex]._id);
    }

    likes.push(...likedUserIds);

    posts.push({
      user_image: user.img,
      name: user.name,
      userId: user._id,
      caption: `This is a sample post caption for ${user.name}.`,
      post_image: `https://example.com/images/post${i + 1}.jpg`,
      likes: likes,
      comments: [com],
    });
  }

  await Post.insertMany(posts);
};

export default postSeed;

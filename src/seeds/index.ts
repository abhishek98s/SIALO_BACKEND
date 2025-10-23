import Post from '../domains/post/post.model';
import Story from '../domains/story/story.model';
import { User } from '../domains/user/user.model';
import connectDB from '../utils/db';
import { postSeed } from './posts.seed';
import { storySeed } from './story.seed';
import { seedUsers, users } from '../seeds/user.seed';
import dotenv from 'dotenv';

dotenv.config();

const startSeed = async () => {
  try {
    await connectDB();
    await User.create(await seedUsers());

    const userArr = await Promise.all(
      users.map(async (user) => {
        const response = await User.findOne({ email: user.email });
        return {
          _id: response!._id.toString(),
          name: response!.name,
          img: response!.img,
        };
      }),
    );

    const posts = postSeed(userArr);
    await Post.create(await posts);

    const stories = await storySeed(userArr);
    await Story.create(await stories);
  } catch (e) {
    console.log(e as Error);
  }
};

startSeed();

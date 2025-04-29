import Post from '../domains/post/post.model';
import Story from '../domains/story/story.model';
import { User } from '../domains/user/user.model';
import { postSeed } from '../seeds/posts.seed';
import { storySeed } from '../seeds/story.seed';
import { seedUsers } from '../seeds/user.seed';
import connectDB from './db';

export interface IFetchUser {
  _id: string;
  name: string;
  img: string | null | undefined;
}

export const populateDb = async () => {
  try {
    await connectDB();
    await User.create(await seedUsers());
    const users = await User.find({});

    const userArr = await Promise.all(
      users.map(async (user) => {
        return { _id: user._id.toString(), name: user.name, img: user.img };
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

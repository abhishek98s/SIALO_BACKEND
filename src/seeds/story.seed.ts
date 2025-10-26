import mongoose from 'mongoose';
import Story, { IStory } from '../domains/story/story.model';
import { IFetchUser } from '../utils/populate';
import { User } from '../domains/user/user.model';
import { imageSeed } from './image.seed';

export const storySeed = async (users: IFetchUser[]): Promise<IStory[]> => {
  await Story.deleteMany({});

  const stories = users.map((user, index) => {
    return {
      user_id: new mongoose.Types.ObjectId(user._id),
      user_name: user.name || '',
      user_image: user.img || '',
      caption: `Story caption for ${user.name}`,
      story_image: imageSeed[index],
    };
  });

  return stories;
};

export let seedStories: IStory[] = [];

(async () => {
  const user = await User.find({});
  const out = user.map((user) => {
    return { name: user.name, img: user.img, _id: user._id?.toString() };
  });
  seedStories = await storySeed(out);
})();

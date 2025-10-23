import mongoose from 'mongoose';
import { IStory } from '../domains/story/story.model';
import { IFetchUser } from '../utils/populate';
import { User } from '../domains/user/user.model';

export const storySeed = async (users: IFetchUser[]): Promise<IStory[]> => {
  const stories = users.map((user, index) => {
    return {
      user_id: new mongoose.Types.ObjectId(user._id),
      user_name: user.name || '',
      user_image: user.img || '',
      caption: `Story caption for ${user.name}`,
      story_image: `https://example.com/images/story${index + 1}.jpg`,
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

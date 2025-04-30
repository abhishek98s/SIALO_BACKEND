import mongoose from 'mongoose';
import { IStory } from '../domains/story/story.model';
import { IFetchUser } from '../utils/populate';

export const storySeed = async (users: IFetchUser[]): Promise<IStory[]> => {
  const stories = [];

  for (let i = 0; i < 3; i++) {
    const user = users[i];

    stories.push({
      user_id: new mongoose.Types.ObjectId(user._id),
      user_name: user.name || '',
      user_image: user.img || '',
      caption: `Story caption for ${user.name}`,
      story_image: `https://example.com/images/story${i + 1}.jpg`,
    });
  }

  return stories;
};

// let seedStories: IStory[] = [];

// (async () => {
//   seedStories = await storySeed();
// })();

// export { seedStories };

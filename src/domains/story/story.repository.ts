import Story, { IStory } from './story.model';
import mongoose from 'mongoose';

export const fetchById = async (
  story_id: string,
): Promise<{
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  user_name: string;
  user_image: string;
  caption: string;
  story_image: string;
  createdAt: Date;
} | null> => {
  return await Story.findById({ _id: story_id }).select([
    '_id',
    'user_id',
    'user_name',
    'user_image',
    'caption',
    'story_image',
    'createdAt',
  ]);
};

export const fetchByUserId = async (user_id: string) => {
  return await Story.find({ user_id: user_id });
};

export const fetchStoriesOfFriends = async (friend_ids: string[]) => {
  return await Story.find({ user_id: { $in: friend_ids } });
};

export const create = async (story_data: IStory) => {
  const story = new Story({ ...story_data });
  const response = await story.save();
  const { _id, user_id, user_name, user_image, story_image } = response;
  return { _id, user_id, user_name, user_image, story_image };
};

export const update = async (story_data: IStory, caption: string) => {
  return await Story.findOneAndUpdate(
    { _id: story_data.id },
    { caption: caption, story_image: story_data.story_image },
    { new: true },
  );
};

export const deleteById = async (story_id: string) => {
  await Story.deleteOne({ _id: story_id });
  return;
};

export const deleteOldStories = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  await Story.deleteMany({
    createdAt: { $lt: twentyFourHoursAgo },
  });
};

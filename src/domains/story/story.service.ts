import { IStory } from './story.model';
import * as StoryDAO from './story.repository';
import * as UserDAO from './../user/user.repository';
import { storyExceptionMessage } from './constant/storyExceptionMessage';
import { userExceptionMessage } from './../user/constant/userExceptionMessage';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { IFriend } from '../user/user.model';

export const getAllStories = async (user_id: string) => {
    const user = await UserDAO.fetchById(user_id.toString());

    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const friends_ids = user.friends.map((friend: IFriend) => friend.id);

    return await StoryDAO.fetchStoriesOfFriends(friends_ids);
};

export const createStory = async (story_data: IStory) => {
    const user = await UserDAO.fetchById(story_data.user.toString());

    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const img_url = await uploadToCloudinary(story_data.storyImage);

    story_data.storyImage = img_url;

    return await StoryDAO.create(story_data);
};

export const updateStory = async (story_id: string, user_id: string, caption: string, file_path: string | null) => {
    const story = await StoryDAO.fetchById(story_id);

    if (!story) throw new Error(storyExceptionMessage.STORY_NOT_FOUND);

    if (story.user.toString() !== user_id.toString()) throw new Error(storyExceptionMessage.NOT_PERMITABLE);

    if (file_path) {
        const img_url = await uploadToCloudinary(file_path);
        story.storyImage = img_url;
    }

    return StoryDAO.update(story, caption);
};

export const deleteStory = async (story_id: string, user_id: string) => {
    const story = await StoryDAO.fetchById(story_id);

    if (!story) throw new Error(storyExceptionMessage.STORY_NOT_FOUND);

    if (story.user.toString() !== user_id.toString()) throw new Error(storyExceptionMessage.NOT_PERMITABLE);

    await StoryDAO.deleteById(story_id);

    return;
};

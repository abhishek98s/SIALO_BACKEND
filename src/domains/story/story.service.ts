import { IStory } from './story.model';
import * as StoryDAO from './story.repository';
import * as UserDAO from './../user/user.repository';
import { storyExceptionMessage } from './constant/storyExceptionMessage';
import { userExceptionMessage } from './../user/constant/userExceptionMessage';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { IFriend } from '../user/user.model';
import mongoose from 'mongoose';

export const getAllStories = async (user_id: string) => {
    const user = await UserDAO.fetchById(user_id.toString());

    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const friends_ids = user.friends.map((friend: IFriend) => {
        if (friend.isFriend) {
            return friend.id
        }
    });

    friends_ids.unshift(user_id);

    const storiesPromises = friends_ids.map((user_id) => {
        return StoryDAO.fetchByUserId(user_id!).then((user_stories) => {

            if (user_stories.length === 0) return;

            const stories_info = user_stories.map((story) => ({
                story_id: story._id,
                story_image: story.story_image,
                caption: story.caption
            }))

            return {
                user_id,
                user_name: user_stories[0].user_name,
                user_image: user_stories[0].user_image,
                stories: stories_info
            }
        })
    })

    const stories = await Promise.all(storiesPromises);

    return stories.filter((story) => story != null);
};


export const createStory = async (story_data: IStory) => {
    const user_id = story_data.user_id.toString();
    const user = await UserDAO.fetchById(user_id);
    const { _id, name } = user;

    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const img_url = await uploadToCloudinary(story_data.story_image);

    story_data.story_image = img_url;
    story_data.user_id = new mongoose.Types.ObjectId(_id);
    story_data.user_name = name;
    story_data.user_image = user.img;

    return await StoryDAO.create(story_data);

};

export const updateStory = async (story_id: string, user_id: string, caption: string, file_path: string | null) => {
    const story = await StoryDAO.fetchById(story_id);

    if (!story) throw new Error(storyExceptionMessage.STORY_NOT_FOUND);

    if (story.user_id.toString() !== user_id.toString()) throw new Error(storyExceptionMessage.NOT_PERMITABLE);

    if (file_path) {
        const img_url = await uploadToCloudinary(file_path);
        story.story_image = img_url;
    }

    return StoryDAO.update(story, caption);
};

export const deleteStory = async (story_id: string, user_id: string) => {
    const story = await StoryDAO.fetchById(story_id);

    if (!story) throw new Error(storyExceptionMessage.STORY_NOT_FOUND);

    if (story.user_id.toString() !== user_id.toString()) throw new Error(storyExceptionMessage.NOT_PERMITABLE);

    await StoryDAO.deleteById(story_id);

    return;
};

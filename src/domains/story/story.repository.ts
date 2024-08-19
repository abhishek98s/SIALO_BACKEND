import Story, { IStory } from './story.model';

export const fetchById = async (story_id: string) => {
    return await Story.findById({ _id: story_id });
};

export const fetchStoriesOfFriends = async (friend_ids: string[]) => {
    return await Story.find({ user: { $in: friend_ids } });
};

export const create = async (story_data: IStory) => {
    const story = new Story({ ...story_data });
    const response = await story.save();
    const { _id, user_id, user_name, user_image, storyImage } = response;
    return { _id, user_id, user_name, user_image, storyImage }
};

export const update = async (story_data: IStory, caption: string) => {
    return await Story.findOneAndUpdate(
        { _id: story_data.id },
        { caption: caption, storyImage: story_data.storyImage },
        { new: true },
    );
};

export const deleteById = async (story_id: string) => {
    await Story.deleteOne({ _id: story_id });
    return;
};

export const deleteOldStories = async () => {
    const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));

    await Story.deleteMany({
        createdAt: { $lt: twentyFourHoursAgo },
    });
};

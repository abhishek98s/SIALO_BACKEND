import { IStory } from './story.model';
import * as StoryDAO from './story.repository';

export const getAllStories = async () => {
    return await StoryDAO.fetchAll();
};

export const createStory = async (story_data: IStory) => {

};

export const updateStory = async (caption: string, file_path: string) => {

};

export const deleteStory = async (id: string) => {

};

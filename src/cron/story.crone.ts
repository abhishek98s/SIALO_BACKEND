import cron from 'node-cron';
import { deleteOldStories } from '../domains/story/story.repository';

export const cron_story = () => {
    cron.schedule('* * * * *', async () => {
        try {
            await deleteOldStories();
            console.log('Cron runned');
        } catch (error) {
            console.error('Error deleting old posts:', error);
        }
    });
};

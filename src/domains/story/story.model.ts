import mongoose from 'mongoose';

export interface IStory {
    id?: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId,
    user_name: string,
    user_image?: string,
    caption: string,
    story_image: string,
    createdAt?: Date
}

export const storySchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        user_name: {
            type: String,
            required: true,
        },
        user_image: {
            type: String,
            required: false,
        },
        caption: {
            type: String,
            required: true,
        },
        story_image: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
);

const Story = mongoose.model('Story', storySchema);

export default Story;

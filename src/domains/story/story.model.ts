import mongoose from 'mongoose';

export interface IStory {
    id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId,
    caption: string,
    storyImage: string,
    createdAt?: Date
}

export const storySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        storyImage: {
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

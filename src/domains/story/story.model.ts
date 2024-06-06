import mongoose, { ObjectId } from 'mongoose';

export interface IStory {
    user: ObjectId,
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

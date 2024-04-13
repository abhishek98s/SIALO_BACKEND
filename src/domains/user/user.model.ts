import mongoose from 'mongoose';

export interface IUser {
    name: string,
    email: string,
    password: string | null,
    img?: string,
}

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String || null,
            required: true,
        },
        img: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);


export const User = mongoose.model('User', userSchema);


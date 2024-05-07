import mongoose from 'mongoose';

export interface IUser {
    _id?: string,
    name: string,
    email: string,
    password: string | null,
    img?: string,
}

export interface IFriend {
    id: string,
    name: string,
    image: string,
    pending: boolean,
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
        friends: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    },
);


export const User = mongoose.model('User', userSchema);


import mongoose from 'mongoose';

export interface IUser {
    _id?: string,
    name: string,
    email: string,
    password: string | null,
    img?: string,
    friends?: Array<IFriend>
}

export interface IFriend {
    id: string,
    name: string,
    image: string,
    pending: boolean,
}

const friendSchema = new mongoose.Schema<IFriend>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    pending: { type: Boolean, required: true },
});

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
        friends: [friendSchema],
    },
    {
        timestamps: true,
    },
);


export const User = mongoose.model('User', userSchema);


import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    name: string,
    phoneNo: number,
    gender: 'Male' | 'Female' | 'Others',
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
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'others'],
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


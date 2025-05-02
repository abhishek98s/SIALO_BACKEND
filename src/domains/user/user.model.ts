import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string | null;
  friends?: Array<IFriend>;
  img?: string;
  coverImg?: string;
}

export interface IFriend {
  id: string;
  name: string;
  image: string;
  pending: boolean;
  isFriend: boolean;
}

export interface IFetchUser {
  _id: string;
  name: string;
  email: string;
  img: string;
  coverImg: string;
  friends: IFriend[];
  password: string;
}

const friendSchema = new mongoose.Schema<IFriend>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  pending: { type: Boolean, required: true },
  isFriend: { type: Boolean, required: true },
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
    coverImg: {
      type: String,
    },
    friends: [friendSchema],
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', userSchema);

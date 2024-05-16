import mongoose from 'mongoose';
import { IFriend, IUser, User } from './user.model';

export const fetchById = async (id: string) => {
    return await User.findOne({ _id: id });
};

export const fetchByEmail = async (email: string) => {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error('User doesnot exist');

    return user;
};

export const fetchByName = async (name: string) => {
    const user = await User.find({ name: { $regex: new RegExp(name, 'ig') } }).select(['name', 'img']);
    if (user.length === 0) throw new Error('User doesnot exist');

    return user;
};

export const fetchAll = async () => {
    return await User.find();
};

export const create = async (new_user: IUser) => {
    const user = new User({ ...new_user });

    return await user.save();
};

export const addFriendInfo = async (user_id: string, friendInfo: IFriend) => {
    return await User.updateOne(
        { _id: user_id },
        { $push: { friends: friendInfo } },
    );
};

export const acceptFriendRequest = async (user_id: string, friend_id: string) => {
    return await User.updateOne(
        { _id: user_id, friends: { $elemMatch: { id: friend_id } } },
        { $set: { 'friends.$.pending': false } },
    );
};

export const rejectFriendRequest = async (user_id: string, friend_id: string) => {
    return await User.updateOne(
        { _id: user_id, friends: { $elemMatch: { id: friend_id } } },
        { $pull: { friends: { id: friend_id } } },
    );
};

export const deleteUserById = async (user_id: string) => {
    return await User.deleteOne({ _id: user_id });
};

export const fetchFriends = async (user_id: string) => {
    return await User.find({ _id: user_id }).select(['friends']);
};

export const fetchRecommendedPeople = async (user_id: string, user_friends: mongoose.Types.ObjectId[]) => {
    return await User.find({ _id: { $nin: user_friends } }).select(['name', 'img']);
};

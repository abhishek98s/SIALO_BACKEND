import { IFriend, IUser, User } from './user.model';

export const fetchById = async (id: string) => {
    return await User.findOne({ _id: id });
};

export const fetchByEmail = async (email: string) => {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error('User doesnot exist');

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
    return await User.updateMany(
        { _id: user_id },
        { $push: { friends: friendInfo } },
    );
};

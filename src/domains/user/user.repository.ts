import { User } from './user.model';

export const getUserById = async (id: string) => {
    return await User.findOne({ _id: id });
};

export const getAllUser = async () => {
    return await User.find();
};

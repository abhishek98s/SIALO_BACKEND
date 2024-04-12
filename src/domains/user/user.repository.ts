import { User } from './user.model';

export const fetchById = async (id: string) => {
    return await User.findOne({ _id: id });
};

export const fetchAll = async () => {
    return await User.find();
};

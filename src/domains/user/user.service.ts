import { User } from './user.model';

export const getUser = async (id: number) => {
    const user = await User.findOne({ _id: id });

    if (!user) throw Error('User doen\'t exist');
    user.password = null;

    return user;
};

export const getAllUser = async () => {
    const data = await User.find();

    if (!data) throw Error('No user available');

    const users = data.map((user) => {
        user.password = null;
        return user;
    });

    return users;
};

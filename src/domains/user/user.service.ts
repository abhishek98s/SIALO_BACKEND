import { userExceptionMessage } from './constant/userExceptionMessage';
import * as UserDAO from './user.repository';

export const getUser = async (id: string) => {
    const user = await UserDAO.getUserById(id);

    if (!user) throw Error(userExceptionMessage.USER_NOT_FOUND);

    return user;
};

export const getAllUser = async () => {
    const users = await UserDAO.getAllUser();

    if (!users) throw Error(userExceptionMessage.USER_NOT_FOUND);

    return users;
};

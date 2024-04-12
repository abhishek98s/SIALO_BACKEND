import { userExceptionMessage } from './constant/userExceptionMessage';
import * as UserDAO from './user.repository';

export const getUser = async (id: string) => {
    const user = await UserDAO.fetchById(id);

    if (!user) throw Error(userExceptionMessage.USER_NOT_FOUND);

    return user;
};

export const fetchAll = async () => {
    const users = await UserDAO.fetchAll();

    if (!users) throw Error(userExceptionMessage.USER_NOT_FOUND);

    return users;
};

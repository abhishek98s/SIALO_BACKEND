import { IJWT } from '../../auth/auth.model';
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

export const addFriend = async (friend_id: string, senderInfo: IJWT) => {
    const requested_user = await UserDAO.fetchById(friend_id);

    if (!requested_user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const { _id, name, img, friends } = requested_user;

    for (const friend of friends) {
        if (friend.id === senderInfo.id) {
            if (!friend.pending) {
                throw new Error(userExceptionMessage.FRIEND_ALREADY);
            }
            throw new Error(userExceptionMessage.REQUEST_SENT_ALREADY);
        }
    }

    await UserDAO.addFriendInfo(friend_id, { ...senderInfo, pending: true });
    await UserDAO.addFriendInfo(senderInfo.id, { id: _id.toString(), name, image: img!, pending: true });

    return requested_user.name;
};

import { IJWT } from '../../auth/auth.model';
import { userExceptionMessage } from './constant/userExceptionMessage';
import * as PostDAO from '../post/post.repository';
import * as UserDAO from './user.repository';
import mongoose from 'mongoose';
import _ from 'lodash';

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

    const requester_friend = requested_user.friends.find(friend => friend.id === senderInfo.id);

    if (requester_friend) {
        if (!requester_friend.pending) {
            throw new Error(userExceptionMessage.FRIEND_ALREADY);
        } else {
            throw new Error(userExceptionMessage.REQUEST_SENT_ALREADY);
        }
    }
    const friendInfo = { id: requested_user._id.toString(), name: requested_user.name, image: requested_user.img!, pending: true };

    await Promise.all([
        UserDAO.addFriendInfo(friend_id, { ...senderInfo, pending: true }),
        UserDAO.addFriendInfo(senderInfo.id, friendInfo),
    ]);

    return requested_user.name;
};

export const acceptFriendRequest = async (sender_id: string, receiver_id: string) => {
    const request_sender = await UserDAO.fetchById(sender_id);

    if (!request_sender) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const sender_friend = request_sender.friends.find(friend => friend.id === receiver_id);

    if (sender_friend && !sender_friend.pending) {
        throw new Error(userExceptionMessage.ACCEPTED_ALREADY);
    }

    await Promise.all([
        UserDAO.acceptFriendRequest(sender_id, receiver_id),
        UserDAO.acceptFriendRequest(receiver_id, sender_id),
    ]);

    return request_sender.name;
};

export const rejectFriendRequest = async (sender_id: string, receiver_id: string) => {
    const request_sender = await UserDAO.fetchById(sender_id);

    if (!request_sender) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const sender_friend = request_sender.friends.find(friend => friend.id === receiver_id);

    if (!sender_friend) {
        throw new Error(userExceptionMessage.REQUEST_NOT_SENT);
    }

    await Promise.all([
        UserDAO.rejectFriendRequest(sender_id, receiver_id),
        UserDAO.rejectFriendRequest(receiver_id, sender_id),
    ]);

    return request_sender.name;
};

export const fetchUserByName = async (searchText: string) => {
    return await UserDAO.fetchByName(searchText);
};

export const removeUserById = async (user_id: string) => {
    const user = await UserDAO.fetchById(user_id);
    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    await PostDAO.removePostsByuserId(user_id);

    const isDeleted = await UserDAO.deleteUserById(user_id);

    if (!isDeleted) throw new Error(userExceptionMessage.DELETE_FAILED);

    return user.name;
};

export const fetchRecommendedPeople = async (user_id: string) => {
    const user = await UserDAO.fetchById(user_id);

    const user_friends_id = user?.friends.map(friend => new mongoose.Types.ObjectId(friend.id));
    const recommend_user = await UserDAO.fetchRecommendedPeople(user_id, user_friends_id!);

    return _.sampleSize(recommend_user, 4);
};

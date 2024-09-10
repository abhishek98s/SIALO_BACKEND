import { IJWT } from '../../auth/auth.model';
import { userExceptionMessage } from './constant/userExceptionMessage';
import * as PostDAO from '../post/post.repository';
import * as UserDAO from './user.repository';
import mongoose from 'mongoose';
import _ from 'lodash';
import { IFriend } from './user.model';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { userSuccessnMessage } from './constant/userSuccessMessage';

export const getUser = async (id: string, sender_id: string) => {
    const user = await UserDAO.fetchById(id);

    if (!user) throw Error(userExceptionMessage.USER_NOT_FOUND);

    let isUserPresent = user.friends.find((friend: IFriend) => friend.id === sender_id);
    let isUserAFriend = isUserPresent && !isUserPresent.pending && isUserPresent.isFriend;
    let isFriendRequestPending = isUserPresent && isUserPresent.pending && !isUserPresent.isFriend;

    if (id === sender_id) {
        isUserAFriend = true;
        isFriendRequestPending = false;
    }

    if (user.friends.length === 0) {
        isUserAFriend = false;
        isFriendRequestPending = false;
    }

    const response = {
        id: user._id,
        email: user.email,
        img: user.img,
        name: user.name,
        friends: user.friends,
        isFriend: isUserAFriend,
        coverImg: user.coverImg,
        isFriendRequestPending
    }

    return response;
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
    const friendInfo: IFriend = { id: requested_user._id.toString(), name: requested_user.name, image: requested_user.img!, pending: true, isFriend: false };

    await Promise.all([
        UserDAO.addFriendInfo(friend_id, { ...senderInfo, pending: true, isFriend: false }),
        UserDAO.addFriendInfo(senderInfo.id, friendInfo),
    ]);

    return requested_user.name;
};

export const getAllFriends = async (user_id: string): Promise<IFriend[]> => {
    const user = await UserDAO.fetchById(user_id);

    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    return await UserDAO.fetchAllFriends(user_id);
};

export const getFriendRequests = async (user_id: string) => {
    const user = await UserDAO.fetchById(user_id);

    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    return await UserDAO.fetchPendingRequests(user_id);
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

    if (!request_sender) {
        await UserDAO.deleteFriend(receiver_id, sender_id);
        throw new Error(userExceptionMessage.USER_NOT_FOUND);
    }

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

export const updateProfilePicture = async (user_id: string, file_path: string) => {
    const user = await UserDAO.fetchById(user_id);

    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const img_url = await uploadToCloudinary(file_path);

    return await UserDAO.updateProfilePicture(user_id, img_url);
};

export const updateCoverPicture = async (user_id: string, file_path: string) => {
    const user = await UserDAO.fetchById(user_id);

    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    const img_url = await uploadToCloudinary(file_path);

    return await UserDAO.updateCoverPicture(user_id, img_url);
};


export const updateUsername = async (user_id: string, updateUsername: string) => {
    const user = await UserDAO.fetchById(user_id);

    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);
    
    const result = await UserDAO.updateUsername(user_id, updateUsername);
    const isUpdated = result.modifiedCount

    if (isUpdated) {
        return userSuccessnMessage.USERNAME_UPDATE_SUCCESS;
    } else {
        throw new Error(userExceptionMessage.UPDATE_FAILED);
    }
};

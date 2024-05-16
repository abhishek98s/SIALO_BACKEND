import { Request, Response } from 'express';

import asyncWrapper from '../../utils/async.ts';
import * as user_service from './user.service.ts';
import { userExceptionMessage } from './constant/userExceptionMessage.ts';

export const getUser = asyncWrapper(async (req: Request, res: Response) => {
    const user_id = req.params.id;

    if (!user_id) {
        throw new Error(userExceptionMessage.INVALID_ID);
    }

    const user = await user_service.getUser(user_id);

    res.status(200).json({ data: user });
});

export const fetchAll = asyncWrapper(async (req: Request, res: Response) => {
    const users = await user_service.fetchAll();

    res.status(200).json({ data: users });
});

export const addFriend = asyncWrapper(async (req: Request, res: Response) => {
    const { id: sender_id, name, image } = req.body.user;
    const friend_id = req.params.friendId;

    if (!friend_id) throw new Error(userExceptionMessage.INVALID_ID);

    if (sender_id === friend_id) throw new Error(userExceptionMessage.ID_SAME);

    const senderInfo = { id: sender_id, name, image };

    const friend = await user_service.addFriend(friend_id, senderInfo);

    res.status(200).json({ success: true, message: `Request sent to ${friend}` });
});

export const acceptRequest = asyncWrapper(async (req: Request, res: Response) => {
    const { id: receiver_id } = req.body.user;
    const sender_id = req.params.friendId;

    if (!sender_id) throw new Error(userExceptionMessage.INVALID_ID);
    if (receiver_id === sender_id) throw new Error(userExceptionMessage.ID_SAME);

    const friend = await user_service.acceptFriendRequest(sender_id, receiver_id);

    res.status(200).json({ success: true, message: `Request accepted of ${friend}` });
});

export const rejectRequest = asyncWrapper(async (req: Request, res: Response) => {
    const { id: receiver_id } = req.body.user;
    const sender_id = req.params.friendId;

    if (!sender_id) throw new Error(userExceptionMessage.INVALID_ID);
    if (receiver_id === sender_id) throw new Error(userExceptionMessage.ID_SAME);

    const friend = await user_service.rejectFriendRequest(sender_id, receiver_id);

    res.status(200).json({ success: true, message: `Request rejected of ${friend}` });
});

export const searchUser = asyncWrapper(async (req: Request, res: Response) => {
    const searchText = req.query.name as unknown as string;

    if (!searchText) throw new Error(userExceptionMessage.EMPTY_STRING);

    const searchResult = await user_service.fetchUserByName(searchText);

    res.status(200).json({ success: true, data: searchResult });
});

export const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
    const user_id = req.params.id as unknown as string;
    if (!user_id) throw new Error(userExceptionMessage.INVALID_ID);

    const deleted_user = await user_service.removeUserById(user_id);

    res.status(200).json({ success: true, message: `Deleted user ${deleted_user}` });
});

export const fetchUnknownPeople = asyncWrapper(async (req: Request, res: Response) => {
    const { id: user_id } = req.body.user;

    if (!user_id) throw new Error(userExceptionMessage.INVALID_ID);

    const unknownPeoples = await user_service.fetchRecommendedPeople(user_id);

    res.status(200).json({ success: true, data: unknownPeoples });
});

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


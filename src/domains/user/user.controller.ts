import { Request, Response } from 'express';

import asyncWrapper from '../../middleware/async.ts';
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

export const getAllUser = asyncWrapper(async (req: Request, res: Response) => {
    const users = await user_service.getAllUser();

    res.status(200).json({ data: users });
});

import { Request, Response } from 'express';
import asyncWrapper from '../../middleware/async.js';
import { getAllUser, getUser } from '../service/userServices.js';

export const getUserHandler = asyncWrapper(async (re: Request, res: Response) => {
    const { id } = req.params;

    let user = await getUser(id);

    res.status(200).json({ data: { ...user } });

})

export const getAllUserHandler = asyncWrapper(async (req, res) => {
    let users = await getAllUser();

    res.status(200).json({ data: { ...users } })
})
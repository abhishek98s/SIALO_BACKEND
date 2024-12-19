/** @format */

import { Request, Response } from 'express';

import asyncWrapper from '../../utils/async';
import * as user_service from './user.service';
import { userExceptionMessage } from './constant/userExceptionMessage';
import { IFriend } from './user.model';
import { StatusCodes } from 'http-status-codes';
import { customHttpError } from '../../utils/customHttpError';

export const getUser = asyncWrapper(async (req: Request, res: Response) => {
  const user_id = req.params.id;
  const { id: sender_id } = req.body.user;

  if (!user_id) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessage.INVALID_ID,
    );
  }

  const user = await user_service.getUser(user_id, sender_id);

  res.status(StatusCodes.OK).json({ status: true, data: user });
});

export const fetchAll = asyncWrapper(async (req: Request, res: Response) => {
  const users = await user_service.fetchAll();

  res.status(StatusCodes.OK).json({ data: users });
});

export const getFriends = asyncWrapper(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const friends: IFriend[] = await user_service.getAllFriends(userId);

  res.status(StatusCodes.OK).json({ status: true, data: friends });
});

export const addFriend = asyncWrapper(async (req: Request, res: Response) => {
  const { id: sender_id, name, image } = req.body.user;
  const friend_id = req.params.friendId;

  if (!friend_id)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessage.INVALID_ID,
    );

  if (sender_id === friend_id)
    throw new customHttpError(
      StatusCodes.FORBIDDEN,
      userExceptionMessage.ID_SAME,
    );

  const senderInfo = { id: sender_id, name, image };

  const friend = await user_service.addFriend(friend_id, senderInfo);

  res
    .status(StatusCodes.OK)
    .json({ status: true, message: `Request sent to ${friend}` });
});

export const getFriendRequests = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: user_id } = req.body.user;

    const pendingRequests = await user_service.getFriendRequests(user_id);

    res.status(StatusCodes.OK).json({ status: true, data: pendingRequests });
  },
);

export const acceptRequest = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: receiver_id } = req.body.user;
    const sender_id = req.params.friendId;

    if (!sender_id)
      throw new customHttpError(
        StatusCodes.BAD_REQUEST,
        userExceptionMessage.INVALID_ID,
      );
    if (receiver_id === sender_id)
      throw new customHttpError(
        StatusCodes.FORBIDDEN,
        userExceptionMessage.ID_SAME,
      );

    const friend = await user_service.acceptFriendRequest(
      sender_id,
      receiver_id,
    );

    res
      .status(StatusCodes.OK)
      .json({ status: true, message: `Request accepted of ${friend}` });
  },
);

export const rejectRequest = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: receiver_id } = req.body.user;
    const sender_id = req.params.friendId;

    if (!sender_id)
      throw new customHttpError(
        StatusCodes.BAD_REQUEST,
        userExceptionMessage.INVALID_ID,
      );
    if (receiver_id === sender_id)
      throw new customHttpError(
        StatusCodes.FORBIDDEN,
        userExceptionMessage.ID_SAME,
      );

    const friend = await user_service.rejectFriendRequest(
      sender_id,
      receiver_id,
    );

    res
      .status(StatusCodes.OK)
      .json({ status: true, message: `Request rejected of ${friend}` });
  },
);

export const searchUser = asyncWrapper(async (req: Request, res: Response) => {
  const searchText = req.query.name as unknown as string;

  if (!searchText)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessage.EMPTY_STRING,
    );

  const searchResult = await user_service.fetchUserByName(searchText);

  res.status(StatusCodes.OK).json({ status: true, data: searchResult });
});

export const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
  const user_id = req.params.id as unknown as string;
  if (!user_id)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessage.INVALID_ID,
    );

  const deleted_user = await user_service.removeUserById(user_id);

  res
    .status(StatusCodes.OK)
    .json({ status: true, message: `Deleted user ${deleted_user}` });
});

export const fetchUnknownPeople = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: user_id } = req.body.user;

    if (!user_id)
      throw new customHttpError(
        StatusCodes.BAD_REQUEST,
        userExceptionMessage.INVALID_ID,
      );

    const unknownPeoples = await user_service.fetchRecommendedPeople(user_id);

    res.status(StatusCodes.OK).json({ status: true, data: unknownPeoples });
  },
);

export const updateProfilePicture = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: user_id } = req.body.user;

    if (!req.file)
      throw new customHttpError(
        StatusCodes.BAD_REQUEST,
        userExceptionMessage.FILE_REQUIRED,
      );

    await user_service.updateProfilePicture(user_id, req.file!.path);

    res
      .status(StatusCodes.OK)
      .json({ status: true, data: [], message: 'Profile picture updated' });
  },
);

export const updateCoverPicture = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: user_id } = req.body.user;

    if (!req.file)
      throw new customHttpError(
        StatusCodes.BAD_REQUEST,
        userExceptionMessage.FILE_REQUIRED,
      );

    await user_service.updateCoverPicture(user_id, req.file!.path);

    res
      .status(StatusCodes.OK)
      .json({ status: true, data: [], message: 'Cover picture updated' });
  },
);

export const updateUsername = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: user_id } = req.body.user;
    const { id: user_params_id } = req.params;
    const { username: updatedUserName } = req.body;

    if (updatedUserName.length < 3)
      throw new customHttpError(
        StatusCodes.BAD_REQUEST,
        userExceptionMessage.USERNAME_LENGTH,
      );

    if (user_id !== user_params_id)
      throw new customHttpError(
        StatusCodes.FORBIDDEN,
        userExceptionMessage.PERMISSION_DENIED,
      );

    const message: string = await user_service.updateUsername(
      user_id,
      updatedUserName,
    );

    res.status(StatusCodes.OK).json({ status: true, data: [], message });
  },
);

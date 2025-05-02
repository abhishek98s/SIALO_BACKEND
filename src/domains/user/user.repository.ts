import mongoose, { isValidObjectId, Types } from 'mongoose';

import { IFetchUser, IFriend, IUser, User } from './user.model';
import { userExceptionMessage } from './constant/userExceptionMessage';
import { customHttpError } from '../../utils/customHttpError';
import { StatusCodes } from 'http-status-codes';

export const fetchById = async (id: string): Promise<IFetchUser> => {
  if (!isValidObjectId(id)) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessage.USER_NOT_FOUND,
    );
  }
  const response = await User.findOne({ _id: new Types.ObjectId(id) }).select([
    '_id',
    'name',
    'email',
    'img',
    'friends',
    'coverImg',
    'password',
  ]);

  // Handle case where user is not found
  if (!response) {
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      userExceptionMessage.USER_NOT_FOUND,
    );
  }

  // Destructure the response
  const { _id, name, email, img, friends, coverImg, password } =
    response.toObject(); // Convert to plain object

  // Create the user object to return
  const user: IFetchUser = {
    _id: _id.toString(),
    name,
    email,
    img: img!,
    friends,
    coverImg: coverImg!,
    password,
  };

  return user;
};

export const fetchByEmail = async (email: string) => {
  const user = await User.findOne({ email: email }).select([
    '_id',
    'name',
    'email',
    'img',
    'friends',
    'password',
  ]);
  return user;
};

export const fetchByName = async (name: string) => {
  return await User.find({ name: { $regex: new RegExp(name, 'ig') } }).select([
    'name',
    'img',
  ]);
};

export const fetchAll = async () => {
  return await User.find().select(['_id', 'name', 'email', 'img', 'friends']);
};

export const create = async (new_user: IUser) => {
  const user = new User({ ...new_user });

  return await user.save();
};

export const fetchAllFriends = async (user_id: string): Promise<IFriend[]> => {
  const userId = new Types.ObjectId(user_id as string);

  const result = await User.aggregate([
    { $match: { _id: userId } },
    {
      $project: {
        friends: {
          $filter: {
            input: '$friends',
            as: 'friend',
            cond: {
              $and: [{ $eq: ['$$friend.isFriend', true] }],
            },
          },
        },
      },
    },
  ]);

  return result[0].friends;
};

export const fetchPendingRequests = async (user_id: string) => {
  const userId = new Types.ObjectId(user_id as string);

  const result = await User.aggregate([
    { $match: { _id: userId } },
    {
      $project: {
        friends: {
          $filter: {
            input: '$friends',
            as: 'friend',
            cond: {
              $and: [
                { $eq: ['$$friend.pending', true] },
                { $eq: ['$$friend.isFriend', false] },
              ],
            },
          },
        },
      },
    },
  ]);

  return result[0].friends;
};

export const addFriendInfo = async (user_id: string, friendInfo: IFriend) => {
  return await User.updateOne(
    { _id: user_id },
    { $push: { friends: friendInfo } },
  );
};

export const acceptFriendRequest = async (
  user_id: string,
  friend_id: string,
) => {
  return await User.updateOne(
    { _id: user_id, friends: { $elemMatch: { id: friend_id } } },
    {
      $set: {
        'friends.$.pending': false,
        'friends.$.isFriend': true,
      },
    },
  );
};

export const rejectFriendRequest = async (
  user_id: string,
  friend_id: string,
) => {
  return await User.updateOne(
    { _id: user_id, friends: { $elemMatch: { id: friend_id } } },
    { $pull: { friends: { id: friend_id } } },
  );
};

export const deleteFriend = async (user_id: string, friend_id: string) => {
  return await User.updateOne(
    { _id: user_id, friends: { $elemMatch: { id: friend_id } } },
    { $pull: { friends: { id: friend_id } } },
  );
};

export const deleteUserById = async (user_id: string) => {
  return await User.deleteOne({ _id: user_id });
};

export const fetchFriends = async (user_id: string) => {
  return await User.find({ _id: user_id }).select(['friends']);
};

export const fetchRecommendedPeople = async (
  user_id: string,
  user_friends: mongoose.Types.ObjectId[],
) => {
  return await User.find({ _id: { $nin: [...user_friends, user_id] } }).select([
    'name',
    'img',
  ]);
};

export const updateProfilePicture = async (
  user_id: string,
  img_url: string,
) => {
  return await User.updateOne(
    { _id: new mongoose.Types.ObjectId(user_id) },
    { $set: { img: img_url } },
  );
};

export const updateCoverPicture = async (user_id: string, img_url: string) => {
  return await User.updateOne(
    { _id: new mongoose.Types.ObjectId(user_id) },
    { $set: { coverImg: img_url } },
  );
};

export const updateUsername = async (
  user_id: string,
  updateUsername: string,
) => {
  return await User.updateOne(
    { _id: user_id },
    { $set: { name: updateUsername } },
  );
};

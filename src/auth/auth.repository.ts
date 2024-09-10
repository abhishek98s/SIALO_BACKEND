import { User } from "../domains/user/user.model";

export const updatePassword = async (user_id: string, newHashedPassword: string) => {
    return await User.updateOne({ _id: user_id }, { $set: { 'password': newHashedPassword } })
};

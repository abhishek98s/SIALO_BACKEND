import bcrypt from 'bcrypt';

import { authExceptionMessage } from '../auth/constant/authExceptionMessage';


export const isMatchingPassword = async (password: string, hashed_password: string) => {
    const isMatch = await bcrypt.compare(password, hashed_password);
    if (!isMatch) throw Error(authExceptionMessage.INVALID_PASS);

    return;
};

export const passwordHash = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
};

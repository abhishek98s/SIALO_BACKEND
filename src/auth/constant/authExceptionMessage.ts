export const authExceptionMessage = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_PASSWORD_REQUIRED: 'Email and password is required.',
  INTERNAL_SERVER_ERRROR: 'Internal server error, try again later',
  INVALID_TOKEN: 'Invalid refresh token',
  PASSWORD_UPDATE: 'Failed to update password',
  SAME_PASSWORD: 'Current password and new password is same',

  NAME_STRING: 'name must be a string.',
  NAME_REQUIRED: 'name is required.',

  EMAIL_STRING: 'email must be a string.',
  EMAIL_REQUIRED: 'email is required.',
  EMAIL_INVALID: 'email is invalid.',
  EMAIL_ALREADY_EXISTS: 'email already exists.',

  PASSWORD_STRING: 'password must be a string.',
  PASSWORD_REQUIRED: 'password is required.',
  INVALID_PASSWORD:
    'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',

  REFRESH_TOKEN_STRING: 'refreshToken must be a string.',
  REFRESH_TOKEN_REQUIRED: 'refreshToken is required.',
};


import multer from 'multer';
import path from 'path';
import { customHttpError } from './customHttpError';
import { StatusCodes } from 'http-status-codes';

const allowedExtensions = /\.(jpg|jpeg|png)$/i;

export const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (!allowedExtensions.test(ext.toLowerCase())) {
      cb(
        new customHttpError(
          StatusCodes.UNSUPPORTED_MEDIA_TYPE,
          'File type is not supported',
        ),
      );
    } else {
      cb(null, true);
    }
  },
});

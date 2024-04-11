import multer from 'multer';
import path from 'path';

const allowedExtensions = /\.(jpg|jpeg|png)$/i;

export const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        if (allowedExtensions.test(ext.toLowerCase())) {
            cb(new Error('File type is not supported'));
        } else {
            cb(null, true);
        }
    },
});

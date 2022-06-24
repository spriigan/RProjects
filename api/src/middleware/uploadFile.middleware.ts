import { Request } from 'express';
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { extname, join } from 'path';
import { BadRequest } from '../types/error.type';
const UPLOAD_PATH = join(process.cwd(), `public/uploads/images/profile`);
const storage = diskStorage({
  destination: UPLOAD_PATH,
  filename: (req, file, callback) => {
    const ext = extname(file.originalname);
    const now = Date.now();
    const filename = `${now}-${nanoid()}${ext}`;
    return callback(null, filename);
  },
});
export default multer({
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req: Request, file, callback) => {
    const ALLOWED_TYPES = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      const err = new BadRequest('use appropriate file extension');
      return callback(err);
    }
    callback(null, true);
  },
  storage,
});

import multer, { MulterError } from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists at project root: uploads/backgrounds
// __dirname -> api/src/middlewares => go up 3 to repo root
const uploadDir = path.resolve(__dirname, '..', '..', '..', 'uploads', 'backgrounds');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (
        req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void,
    ) {
        cb(null, uploadDir);
    },

    filename: function (
        req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void,
    ) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname) || '';
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExt.includes(ext)) {
            return cb(new MulterError("LIMIT_UNEXPECTED_FILE"));
        }
        cb(null, true);
    },
});

export default upload;
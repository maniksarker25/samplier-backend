"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const uploadFile = () => {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            let uploadPath = '';
            if (file.fieldname === 'profile_image') {
                uploadPath = 'uploads/images/profile';
            }
            else if (file.fieldname === 'category_image') {
                uploadPath = 'uploads/images/category';
            }
            else if (file.fieldname === 'product_image') {
                uploadPath = 'uploads/images/product_image';
            }
            else if (file.fieldname === 'review_image') {
                uploadPath = 'uploads/images/review_image';
            }
            else if (file.fieldname === 'review_video') {
                uploadPath = 'uploads/video/review_video';
            }
            else if (file.fieldname === 'comment_image') {
                uploadPath = 'uploads/images/comment_image';
            }
            else if (file.fieldname === 'thumbnail') {
                uploadPath = 'uploads/images/thumbnail';
            }
            else if (file.fieldname.startsWith('variant_image')) {
                uploadPath = 'uploads/images/variant_image';
            }
            else if (file.fieldname === 'team_bg_image') {
                uploadPath = 'uploads/images/team_bg_image';
            }
            else if (file.fieldname === 'player_image') {
                uploadPath = 'uploads/images/player_image';
            }
            else if (file.fieldname === 'bussinessLicense') {
                uploadPath = 'uploads/document/bussiness';
            }
            else if (file.fieldname === 'incorparationCertificate') {
                uploadPath = 'uploads/document/bussiness';
            }
            else if (file.fieldname === 'logo') {
                uploadPath = 'uploads/images/bussiness_logo';
            }
            else if (file.fieldname === 'coverImage') {
                uploadPath = 'uploads/images/bussinessCover';
            }
            else {
                uploadPath = 'uploads';
            }
            if (!fs_1.default.existsSync(uploadPath)) {
                fs_1.default.mkdirSync(uploadPath, { recursive: true });
            }
            if (file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/webp' ||
                file.mimetype === 'video/mp4' ||
                file.mimetype === 'video/mov' ||
                file.mimetype === 'video/quicktime' ||
                file.mimetype === 'video/mpeg' ||
                file.mimetype === 'video/ogg' ||
                file.mimetype === 'video/webm' ||
                file.mimetype === 'video/x-msvideo' ||
                file.mimetype === 'video/x-flv' ||
                file.mimetype === 'video/3gpp' ||
                file.mimetype === 'video/3gpp2' ||
                file.mimetype === 'video/x-matroska') {
                cb(null, uploadPath);
            }
            else {
                //@ts-ignore
                cb(new Error('Invalid file type'));
            }
        },
        filename: function (req, file, cb) {
            const name = Date.now() + '-' + file.originalname;
            cb(null, name);
        },
    });
    const fileFilter = (req, file, cb) => {
        const allowedFieldnames = [
            'image',
            'profile_image',
            'product_image',
            'category_image',
            'variant_image',
            'team_bg_image',
            'bussinessLicense',
            'incorparationCertificate',
            'coverImage',
            'logo',
            'reward_image',
            'video',
            'thumbnail',
            'review_video',
            'review_image',
            'comment_image',
        ];
        if (file.fieldname === undefined) {
            // Allow requests without any files
            cb(null, true);
        }
        else if (allowedFieldnames.includes(file.fieldname) ||
            file.fieldname.startsWith('variant_image')) {
            if (file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/webp' ||
                file.mimetype === 'video/mp4' ||
                file.mimetype === 'application/pdf') {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type'));
            }
        }
        else {
            cb(new Error('Invalid fieldname'));
        }
    };
    const upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: fileFilter,
    }).fields([
        { name: 'image', maxCount: 1 },
        { name: 'profile_image', maxCount: 1 },
        { name: 'category_image', maxCount: 1 },
        { name: 'sub_category_image', maxCount: 1 },
        { name: 'product_image', maxCount: 5 },
        { name: 'variant_image', maxCount: 5 },
        { name: 'bussinessLicense', maxCount: 1 },
        { name: 'incorparationCertificate', maxCount: 1 },
        { name: 'player_bg_image', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 },
        { name: 'logo', maxCount: 1 },
        { name: 'review_video', maxCount: 1 },
        { name: 'review_image', maxCount: 3 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'comment_image', maxCount: 1 },
    ]);
    return upload;
};
exports.uploadFile = uploadFile;

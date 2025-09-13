"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDynamicFile = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const uploadDynamicFile = () => {
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
            // else if (file.fieldname === 'variant_image') {
            //   uploadPath = 'uploads/images/variant_image';
            // }
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
                file.mimetype === 'application/pdf') {
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
    //   const upload = multer({
    //     storage: storage,
    //     fileFilter: fileFilter,
    //   }).fields([
    //     { name: 'image', maxCount: 1 },
    //     { name: 'profile_image', maxCount: 1 },
    //     { name: 'category_image', maxCount: 1 },
    //     { name: 'sub_category_image', maxCount: 1 },
    //     { name: 'product_image', maxCount: 5 },
    //     { name: 'variant_image', maxCount: 5 },
    //     { name: 'bussinessLicense', maxCount: 1 },
    //     { name: 'incorparationCertificate', maxCount: 1 },
    //     { name: 'player_bg_image', maxCount: 1 },
    //     { name: 'coverImage', maxCount: 1 },
    //     { name: 'logo', maxCount: 1 },
    //     { name: 'video', maxCount: 1 },
    //   ]);
    const upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: fileFilter,
    }).any();
    return upload;
};
exports.uploadDynamicFile = uploadDynamicFile;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMultiplePresignedUrls = exports.generatePresignedUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
const appError_1 = __importDefault(require("../error/appError"));
const http_status_1 = __importDefault(require("http-status"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const generatePresignedUrl = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fileType, fileCategory, }) {
    const timestamp = Date.now();
    let folder = '';
    if (fileCategory === 'profile_image') {
        folder = 'uploads/profile_images/';
    }
    else if (fileCategory === 'project_image') {
        folder = 'uploads/project_image/';
    }
    else if (fileCategory === 'video') {
        folder = 'uploads/videos/';
    }
    else if (fileCategory === 'project_document') {
        folder = 'uploads/project_document/';
    }
    else if (fileCategory === 'material_image') {
        folder = 'uploads/project_material_image/';
    }
    const fileName = `${folder}${timestamp}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileType.split('/')[1]}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        ContentType: fileType,
        // ACL: 'public-read', // You can add this if needed and your bucket allows it
    });
    try {
        const uploadURL = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 60 }); // URL valid for 60 seconds
        return { uploadURL, fileName };
    }
    catch (err) {
        console.error('Error generating presigned URL:', err);
        throw new appError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Error generating presigned URL');
    }
});
exports.generatePresignedUrl = generatePresignedUrl;
const generateMultiplePresignedUrls = (files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const presignedUrls = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, exports.generatePresignedUrl)(file);
        })));
        return presignedUrls;
    }
    catch (err) {
        console.error('Error generating multiple presigned URLs:', err);
        throw new appError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Error generating multiple presigned URLs');
    }
});
exports.generateMultiplePresignedUrls = generateMultiplePresignedUrls;

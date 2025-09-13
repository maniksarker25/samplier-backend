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
exports.deleteFileFromS3 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize the S3 client
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const deleteFileFromS3 = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedFileName = fileName.split('cloudfront.net/')[1];
    const decodedFileName = decodeURIComponent(updatedFileName);
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    try {
        // 1. Check if the file exists in S3
        const headCommand = new client_s3_1.HeadObjectCommand({
            Bucket: bucket,
            Key: decodedFileName,
        });
        try {
            yield s3.send(headCommand);
        }
        catch (err) {
            if (err.name === 'NotFound') {
                console.log(`File ${decodedFileName} does not exist in S3.`);
                return;
            }
            throw err;
        }
        // 2. Delete the file
        const deleteCommand = new client_s3_1.DeleteObjectCommand({
            Bucket: bucket,
            Key: decodedFileName,
        });
        yield s3.send(deleteCommand);
        console.log(`Successfully deleted ${decodedFileName} from S3`);
    }
    catch (err) {
        if (err.name === 'NotFound') {
            console.error(`File ${decodedFileName} was not found in S3.`);
        }
        else {
            console.error('Error deleting file from S3:', err);
        }
    }
});
exports.deleteFileFromS3 = deleteFileFromS3;

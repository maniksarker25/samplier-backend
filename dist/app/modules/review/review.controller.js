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
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const catchasync_1 = __importDefault(require("../../utilities/catchasync"));
const sendResponse_1 = __importDefault(require("../../utilities/sendResponse"));
const review_service_1 = __importDefault(require("./review.service"));
const multer_s3_uploader_1 = require("../../aws/multer-s3-uploader");
const createReview = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.review_image) {
        req.body.images = req.files.review_image.map((file) => {
            return (0, multer_s3_uploader_1.getCloudFrontUrl)(file.key);
        });
    }
    const videoFile = (_b = req.files) === null || _b === void 0 ? void 0 : _b.review_video;
    if ((_c = req.files) === null || _c === void 0 ? void 0 : _c.review_video) {
        req.body.video = (0, multer_s3_uploader_1.getCloudFrontUrl)(videoFile[0].key);
    }
    const thumnail = (_d = req.files) === null || _d === void 0 ? void 0 : _d.thumbnail;
    if ((_e = req.files) === null || _e === void 0 ? void 0 : _e.thumbnail) {
        req.body.thumbnail = (0, multer_s3_uploader_1.getCloudFrontUrl)(thumnail[0].key);
    }
    const result = yield review_service_1.default.createReview(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
}));
// get all review
const getAllReview = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.default.getAllReviewFromDB(req.user.profileId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review retrieved successfully',
        data: result,
    });
}));
// get my reviews
const getMyReview = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.default.getMyReviews(req.user.profileId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review retrieved successfully',
        data: result,
    });
}));
// get review liker
const getReviewLikers = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.default.getReviewLikers(req.params.id, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review likers retrieved successfully',
        data: result,
    });
}));
//
const likeUnlikeReview = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.default.likeUnlikeReview(req.params.id, req.user.profileId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Liked added successfully',
        data: result,
    });
}));
//
const getSingleProductReview = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.default.getSingleProductReview(req.params.id, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single product review retrieved successfully',
        data: result,
    });
}));
const ReviewController = {
    createReview,
    getAllReview,
    getReviewLikers,
    likeUnlikeReview,
    getMyReview,
    getSingleProductReview,
};
exports.default = ReviewController;

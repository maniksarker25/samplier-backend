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
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const multer_s3_uploader_1 = require("../../aws/multer-s3-uploader");
const catchasync_1 = __importDefault(require("../../utilities/catchasync"));
const sendResponse_1 = __importDefault(require("../../utilities/sendResponse"));
const comment_service_1 = __importDefault(require("./comment.service"));
const createComment = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.comment_image;
    if ((_b = req.files) === null || _b === void 0 ? void 0 : _b.comment_image) {
        req.body.image = (0, multer_s3_uploader_1.getCloudFrontUrl)(file[0].key);
    }
    const result = yield comment_service_1.default.createComment(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment created successfully',
        data: result,
    });
}));
const createReply = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.comment_image;
    if ((_b = req.files) === null || _b === void 0 ? void 0 : _b.comment_image) {
        req.body.image = (0, multer_s3_uploader_1.getCloudFrontUrl)(file[0].key);
    }
    const result = yield comment_service_1.default.createReply(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reply created successfully',
        data: result,
    });
}));
const updateComment = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.comment_image;
    if ((_b = req.files) === null || _b === void 0 ? void 0 : _b.comment_image) {
        req.body.image = (0, multer_s3_uploader_1.getCloudFrontUrl)(file[0].key);
    }
    const result = yield comment_service_1.default.updateComment(req.user, req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment updated successfully',
        data: result,
    });
}));
const deleteComment = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.default.deleteComment(req.user.profileId, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment deleted successfully',
        data: result,
    });
}));
const likeUnlikeComment = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.default.likeUnlikeComment(req.params.id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment  successfully',
        data: result,
    });
}));
const getReviewComments = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.default.getReviewComments(req.user.profileId, req.params.id, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment retrieved  successfully',
        data: result,
    });
}));
const getReplies = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.default.getReplies(req.user.profileId, req.params.id, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Replies retrieved  successfully',
        data: result,
    });
}));
const getAllLikersForComment = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.default.getAllLikersForComment(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Likers retrieved  successfully',
        data: result,
    });
}));
// get my comments
const getMyComments = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.default.getMyComments(req.user.profileId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment retrieved successfully',
        data: result,
    });
}));
const getMyLikes = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.default.getMyLinkes(req.user.profileId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Like retrieved successfully',
        data: result,
    });
}));
const CommentController = {
    createComment,
    createReply,
    updateComment,
    deleteComment,
    getReviewComments,
    likeUnlikeComment,
    getReplies,
    getAllLikersForComment,
    getMyComments,
    getMyLikes,
};
exports.default = CommentController;

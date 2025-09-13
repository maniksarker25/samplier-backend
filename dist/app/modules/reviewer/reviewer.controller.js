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
const reviewer_service_1 = __importDefault(require("./reviewer.service"));
const getReviewerProfile = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_service_1.default.getReviewerProfile(req.user.profileId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
}));
const addAddress = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_service_1.default.addAddress(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Address added successfully',
        data: result,
    });
}));
const addPersonalInfo = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_service_1.default.addPersonalInfo(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Personal info added successfully',
        data: result,
    });
}));
const addInterestedCategory = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_service_1.default.addInterestedCategory(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Interested category info added successfully',
        data: result,
    });
}));
const addCurrentlyShareReview = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_service_1.default.addCurrentlyShareReview(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Currently share review added successfully',
        data: result,
    });
}));
const addSocailInfo = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_service_1.default.addSocailInfo(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Socail info  added successfully',
        data: result,
    });
}));
const makeSkip = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_service_1.default.makeSkip(req.user.profileId, req.body.skipValue);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `${req.body.skipValue} is skipped successfully`,
        data: result,
    });
}));
const updateReviewerIntoDB = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.profile_image;
    if ((_b = req.files) === null || _b === void 0 ? void 0 : _b.profile_image) {
        req.body.profile_image = (0, multer_s3_uploader_1.getCloudFrontUrl)(file[0].key);
    }
    const result = yield reviewer_service_1.default.updateReviewerIntoDB(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
}));
// follow unfollow reviewer
const followUnfollowReviewer = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_service_1.default.followUnfollowReviewer(req.user.profileId, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.following
            ? 'Successfully followed'
            : 'Successfully Unfollowed',
        data: result,
    });
}));
const followUnfollowBussiness = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_service_1.default.followUnfollowBussiness(req.user.profileId, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.following
            ? 'Successfully followed'
            : 'Successfully Unfollowed',
        data: result,
    });
}));
const ReviewerController = {
    addAddress,
    addPersonalInfo,
    addInterestedCategory,
    addCurrentlyShareReview,
    addSocailInfo,
    updateReviewerIntoDB,
    makeSkip,
    getReviewerProfile,
    followUnfollowReviewer,
    followUnfollowBussiness,
};
exports.default = ReviewerController;

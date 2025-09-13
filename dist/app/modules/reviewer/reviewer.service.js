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
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = __importDefault(require("../../error/appError"));
const enum_1 = require("../../utilities/enum");
const bussiness_model_1 = __importDefault(require("../bussiness/bussiness.model"));
const reviewer_model_1 = __importDefault(require("./reviewer.model"));
const getReviewerProfile = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_model_1.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(profileId),
            },
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'interestedCategory',
                foreignField: '_id',
                as: 'interestedCategory',
            },
        },
        {
            $lookup: {
                from: 'follows',
                localField: '_id',
                foreignField: 'following',
                as: 'followersData',
            },
        },
        {
            $lookup: {
                from: 'follows',
                localField: '_id',
                foreignField: 'follower',
                as: 'followingData',
            },
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'reviewer',
                as: 'reviewsData',
            },
        },
        {
            $project: {
                _id: 1,
                user: 1,
                name: 1,
                username: 1,
                email: 1,
                city: 1,
                zipcode: 1,
                gender: 1,
                age: 1,
                ethnicity: 1,
                educationLevel: 1,
                maritalStatus: 1,
                employmentStatus: 1,
                householdIncome: 1,
                familyAndDependents: 1,
                interestedCategory: 1,
                currentlyShareReview: 1,
                interestedCategoryStatus: 1,
                currentShareReviewStatus: 1,
                shippingInformationStatus: 1,
                socailInfoStatus: 1,
                profileDetailStatus: 1,
                receiveProductBy: 1,
                minPriceForReview: 1,
                maxPriceForReview: 1,
                isPersonalInfoProvided: 1,
                isAddressProvided: 1,
                profile_image: 1,
                bio: 1,
                instagram: 1,
                youtube: 1,
                twitter: 1,
                tiktok: 1,
                whatsapp: 1,
                facebook: 1,
                blog: 1,
                totalEarning: 1,
                currentBalance: 1,
                createdAt: 1,
                updatedAt: 1,
                totalFollowers: { $size: '$followersData' },
                totalFollowing: { $size: '$followingData' },
                totalReviews: { $size: '$reviewsData' },
            },
        },
    ]);
    console.log('result', result);
    return result[0];
});
const addAddress = (reviewerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.isAddressProvided = true;
    const result = yield reviewer_model_1.default.findByIdAndUpdate(reviewerId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const addPersonalInfo = (reviewerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.isPersonalInfoProvided = true;
    const result = yield reviewer_model_1.default.findByIdAndUpdate(reviewerId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const addInterestedCategory = (reviewerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.interestedCategoryStatus = enum_1.INTEREST_STATUS.COMPLETED;
    const result = yield reviewer_model_1.default.findByIdAndUpdate(reviewerId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const addCurrentlyShareReview = (reviewerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.interestedCategoryStatus = enum_1.INTEREST_STATUS.COMPLETED;
    const result = yield reviewer_model_1.default.findByIdAndUpdate(reviewerId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const addSocailInfo = (reviewerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.socailInfoStatus = enum_1.INTEREST_STATUS.COMPLETED;
    const result = yield reviewer_model_1.default.findByIdAndUpdate(reviewerId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// update reviewer
const updateReviewerIntoDB = (reviewerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.username) {
        const isExist = yield reviewer_model_1.default.findById({ username: payload.username });
        if (isExist) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This username not available');
        }
    }
    const result = yield reviewer_model_1.default.findByIdAndUpdate(reviewerId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const makeSkip = (reviewerId, skipValue) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewer_model_1.default.findByIdAndUpdate(reviewerId, {
        $set: { [skipValue]: enum_1.INTEREST_STATUS.SKIPPED },
    }, { new: true, runValidators: true });
    return result;
});
const followUnfollowReviewer = (followerId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(followerId) ||
            !mongoose_1.default.Types.ObjectId.isValid(followingId)) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid user IDs');
        }
        if (followerId === followingId) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'You cannot follow yourself');
        }
        const followerObjectId = new mongoose_1.default.Types.ObjectId(followerId);
        const followingObjectId = new mongoose_1.default.Types.ObjectId(followingId);
        const followingUser = yield reviewer_model_1.default.findById(followingId).select('followers');
        if (!followingUser) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Reviewer not found');
        }
        const alreadyFollowing = followingUser.followers.includes(followerObjectId);
        yield reviewer_model_1.default.findByIdAndUpdate(followerId, alreadyFollowing
            ? { $pull: { following: followingObjectId } }
            : { $addToSet: { following: followingObjectId } }, { new: true });
        yield reviewer_model_1.default.findByIdAndUpdate(followingId, alreadyFollowing
            ? { $pull: { followers: followerObjectId } }
            : { $addToSet: { followers: followerObjectId } }, { new: true });
        const totalFollowers = yield reviewer_model_1.default.findById(followingId).select('followers');
        const totalFollowersCount = totalFollowers === null || totalFollowers === void 0 ? void 0 : totalFollowers.followers.length;
        return {
            followingId,
            following: !alreadyFollowing,
            totalFollowers: totalFollowersCount,
        };
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong while following/unfollowing user');
    }
});
const followUnfollowBussiness = (profileId, bussinessId) => __awaiter(void 0, void 0, void 0, function* () {
    const bussiness = yield bussiness_model_1.default.findById(bussinessId);
    if (!bussiness) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Store not found');
    }
    const followerObjectId = new mongoose_1.default.Types.ObjectId(profileId);
    const alreadyFollowing = bussiness.followers.includes(followerObjectId);
    yield reviewer_model_1.default.findByIdAndUpdate(profileId, alreadyFollowing
        ? { $pull: { following: bussinessId } }
        : { $addToSet: { following: bussinessId } }, { new: true });
    yield bussiness_model_1.default.findByIdAndUpdate(bussinessId, alreadyFollowing
        ? { $pull: { followers: followerObjectId } }
        : { $addToSet: { followers: followerObjectId } }, { new: true });
    return {
        following: !alreadyFollowing,
    };
});
const ReviewerService = {
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
exports.default = ReviewerService;

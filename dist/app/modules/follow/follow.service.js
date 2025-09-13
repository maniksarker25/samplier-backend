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
const appError_1 = __importDefault(require("../../error/appError"));
const follow_model_1 = __importDefault(require("./follow.model"));
const followUnfollowUser = (followerId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    if (followerId === followingId) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You can't follow yourself");
    }
    const existing = yield follow_model_1.default.findOne({
        follower: followerId,
        following: followingId,
    });
    if (existing) {
        // Unfollow
        yield follow_model_1.default.findByIdAndDelete(existing._id);
        return { action: 'unfollowed' };
    }
    else {
        // Follow
        yield follow_model_1.default.create({
            follower: followerId,
            following: followingId,
        });
        return { action: 'followed' };
    }
});
const getFollowers = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return follow_model_1.default.find({ following: userId })
        .select('follower -_id')
        .populate('follower', 'name email');
});
const getFollowing = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return follow_model_1.default.find({ follower: userId })
        .select('following -_id')
        .populate('following', 'name email');
});
const FollowServices = {
    followUnfollowUser,
    getFollowers,
    getFollowing,
};
exports.default = FollowServices;

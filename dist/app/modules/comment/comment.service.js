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
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../error/appError"));
const reviewer_model_1 = __importDefault(require("../review/reviewer.model"));
const comment_model_1 = __importDefault(require("./comment.model"));
const createComment = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const commentData = Object.assign(Object.assign({}, payload), { commentor: user.profileId, likers: [] });
    const result = yield comment_model_1.default.create(commentData);
    return result;
});
const createReply = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Creating reply with payload:');
    const comment = yield comment_model_1.default.findById(payload.parent);
    if (!comment) {
        throw new appError_1.default(404, 'Parent comment not found');
    }
    const replyData = Object.assign(Object.assign({}, payload), { commentor: user.profileId, likers: [], review: comment.review });
    const result = yield comment_model_1.default.create(replyData);
    return result;
});
const updateComment = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.default.findOneAndUpdate({ _id: id, commentor: user.profileId }, payload, { new: true, runValidators: true });
    if (!result) {
        throw new appError_1.default(404, 'Comment not found or you are not authorized to update this comment');
    }
    return result;
});
const deleteComment = (profileId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.default.findOneAndDelete({
        _id: id,
        commentor: profileId,
    });
    if (!result) {
        throw new appError_1.default(404, 'Comment not found or you are not authorized to update this comment');
    }
    return result;
});
// like unlike comment
const likeUnlikeComment = (commentId, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const comment = yield comment_model_1.default.findById(commentId).select('likers');
    if (!comment) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found');
    }
    const userObjectId = new mongoose_1.default.Types.ObjectId(user.profileId);
    const alreadyLiked = comment.likers.some((l) => l.equals(userObjectId));
    let updatedComment;
    if (alreadyLiked) {
        updatedComment = yield comment_model_1.default.findByIdAndUpdate(commentId, { $pull: { likers: userObjectId } }, { new: true }).select('likers');
    }
    else {
        updatedComment = yield comment_model_1.default.findByIdAndUpdate(commentId, { $push: { likers: userObjectId } }, { new: true }).select('likers');
    }
    return {
        commentId,
        liked: !alreadyLiked,
        totalLikes: (_a = updatedComment === null || updatedComment === void 0 ? void 0 : updatedComment.likers.length) !== null && _a !== void 0 ? _a : 0,
    };
});
const getReviewComments = (profileId, review, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const comments = yield comment_model_1.default.aggregate([
        {
            $match: {
                review: new mongoose_1.default.Types.ObjectId(review),
                parent: null,
            },
        },
        {
            $lookup: {
                from: 'reviewers',
                localField: 'commentor',
                foreignField: '_id',
                as: 'commentorDetails',
            },
        },
        {
            $addFields: {
                commentorDetails: '$commentorDetails',
                isMyComment: {
                    $eq: ['$commentor', new mongoose_1.default.Types.ObjectId(profileId)],
                },
                totalLike: { $size: '$likers' },
                isMyLike: {
                    $in: [new mongoose_1.default.Types.ObjectId(profileId), '$likers'],
                },
            },
        },
        { $unwind: '$commentorDetails' },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'parent',
                as: 'replies',
            },
        },
        {
            $addFields: {
                totalReplies: { $size: '$replies' },
            },
        },
        {
            $project: {
                _id: 1,
                text: 1,
                image: 1,
                createdAt: 1,
                updatedAt: 1,
                commentorName: '$commentorDetails.name',
                commentorProfileImage: '$commentorDetails.profile_image',
                totalReplies: 1,
                totalLike: 1,
                isMyComment: 1,
                isMyLike: 1,
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $facet: {
                result: [{ $skip: skip }, { $limit: limit }],
                totalCount: [{ $count: 'total' }],
            },
        },
    ]);
    const result = ((_a = comments[0]) === null || _a === void 0 ? void 0 : _a.result) || [];
    const total = ((_c = (_b = comments[0]) === null || _b === void 0 ? void 0 : _b.totalCount[0]) === null || _c === void 0 ? void 0 : _c.total) || 0;
    const totalPage = Math.ceil(total / limit);
    const response = {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        result,
    };
    return response;
});
const getReplies = (profileId, parentId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const comments = yield comment_model_1.default.aggregate([
        {
            $match: {
                parent: new mongoose_1.default.Types.ObjectId(parentId),
            },
        },
        {
            $lookup: {
                from: 'reviewers',
                localField: 'commentor',
                foreignField: '_id',
                as: 'commentorDetails',
            },
        },
        {
            $addFields: {
                commentorDetails: '$commentorDetails',
                isMyComment: {
                    $eq: ['$commentor', new mongoose_1.default.Types.ObjectId(profileId)],
                },
                totalLike: { $size: '$likers' },
                isMyLike: {
                    $in: [new mongoose_1.default.Types.ObjectId(profileId), '$likers'],
                },
            },
        },
        { $unwind: '$commentorDetails' },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'parent',
                as: 'replies',
            },
        },
        {
            $addFields: {
                totalReplies: { $size: '$replies' },
            },
        },
        {
            $project: {
                _id: 1,
                text: 1,
                createdAt: 1,
                updatedAt: 1,
                commentorName: '$commentorDetails.name',
                commentorProfileImage: '$commentorDetails.profile_image',
                totalReplies: 1,
                isMyComment: 1,
                totalLike: 1,
                isMyLike: 1,
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $facet: {
                result: [{ $skip: skip }, { $limit: limit }],
                totalCount: [{ $count: 'total' }],
            },
        },
    ]);
    const result = ((_a = comments[0]) === null || _a === void 0 ? void 0 : _a.result) || [];
    const total = ((_c = (_b = comments[0]) === null || _b === void 0 ? void 0 : _b.totalCount[0]) === null || _c === void 0 ? void 0 : _c.total) || 0;
    const totalPage = Math.ceil(total / limit);
    const response = {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        result,
    };
    return response;
});
const getAllLikersForComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.default.findById(commentId).populate('likers', 'name profile_image');
    if (!comment) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found');
    }
    const likers = comment.likers;
    return likers;
});
const getMyComments = (reviewerId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const commentQuery = new QueryBuilder_1.default(comment_model_1.default.find({
        commentor: reviewerId,
        parentCommentId: null,
    })
        .populate({
        path: 'review',
        select: 'description images video thumbnail rating createdAt likers',
        populate: [
            { path: 'product', select: 'name price' },
            { path: 'category', select: 'name' },
            { path: 'reviewer', select: 'name profile_image' },
        ],
    })
        .populate({ path: 'commentor', select: 'name username profile_image' }), query);
    const result = yield commentQuery.modelQuery;
    const meta = yield commentQuery.countTotal();
    return {
        meta,
        result,
    };
});
// get my likes
const getMyLinkes = (profileId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const likeQuery = new QueryBuilder_1.default(reviewer_model_1.default.find({ likers: { $in: [profileId] } })
        .populate({ path: 'product', select: 'name price' })
        .populate({ path: 'category', select: 'name' })
        .populate({ path: 'reviewer', select: 'name profile_image' }), query);
    // const result = await likeQuery.modelQuery;
    let result = yield likeQuery.modelQuery;
    result = yield Promise.all(result.map((review) => __awaiter(void 0, void 0, void 0, function* () {
        const totalComments = yield comment_model_1.default.countDocuments({
            review: review._id,
        });
        const isLike = review.likers.some((liker) => liker.equals(profileId));
        return Object.assign(Object.assign({}, review.toObject()), { totalComments,
            isLike });
    })));
    const meta = yield likeQuery.countTotal();
    return {
        meta,
        result,
    };
});
const CommentServices = {
    createComment,
    createReply,
    updateComment,
    deleteComment,
    likeUnlikeComment,
    getReviewComments,
    getReplies,
    getAllLikersForComment,
    getMyComments,
    getMyLinkes,
};
exports.default = CommentServices;

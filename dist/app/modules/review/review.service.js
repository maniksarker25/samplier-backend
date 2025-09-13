"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../error/appError"));
const campaignOffer_model_1 = require("../campaignOffer/campaignOffer.model");
const comment_model_1 = __importDefault(require("../comment/comment.model"));
const reviewer_model_1 = __importDefault(require("../reviewer/reviewer.model"));
const reviewer_model_2 = __importDefault(require("./reviewer.model"));
const createReview = (reviewerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const campaignOffer = yield campaignOffer_model_1.CampaignOffer.findById(payload.campaignOfferId)
        .populate({
        path: 'campaign',
        select: 'status',
    })
        .populate({ path: 'product', select: 'category' });
    if (!campaignOffer) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This campaign offer not found');
    }
    // if (campaignOffer.campaign.status !== CAMPAIGN_STATUS.ACTIVE) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     'This campaign not active right now',
    //   );
    // }
    // TODO: when create review---------------
    const result = yield reviewer_model_2.default.create(Object.assign(Object.assign({}, payload), { reviewer: reviewerId, campaign: campaignOffer.campaign._id, product: campaignOffer.product._id, category: campaignOffer.product.category, bussiness: campaignOffer.business, amount: campaignOffer.amount }));
    return result;
});
// //----------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// const getAllReviewFromDB = async (
//   reviewerId: string,
//   query: Record<string, unknown>,
// ) => {
//   const reviewer = await Reviewer.findById(reviewerId).select('following');
//   let filterQuery = {};
//   if (query.following) {
//     filterQuery = { reviewer: { $in: reviewer?.following } };
//   }
//   const reviewQuery = new QueryBuilder(
//     Review.find({ ...filterQuery })
//       .populate({ path: 'product', select: 'name price' })
//       .populate({ path: 'category', select: 'name' })
//       .populate({ path: 'reviewer', select: 'name username profile_image' }),
//     query,
//   )
//     .search(['description'])
//     .filter()
//     .sort()
//     .paginate()
//     .fields();
//   let reviews = await reviewQuery.modelQuery;
//   reviews = await Promise.all(
//     reviews.map(async (review: any) => {
//       const totalComments = await Comment.countDocuments({
//         reviewId: review._id,
//       });
//       const isLike = review.likers.some((liker: Types.ObjectId) =>
//         liker.equals(reviewerId),
//       );
//       return {
//         ...review.toObject(),
//         totalComments,
//         isLike,
//       };
//     }),
//   );
//   const meta = await reviewQuery.countTotal();
//   return {
//     meta,
//     result: reviews,
//   };
// };
const getAllReviewFromDB = (reviewerId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const reviewer = yield reviewer_model_1.default.findById(reviewerId).select('following');
    const matchStage = {};
    if (query.following) {
        matchStage.reviewer = { $in: (reviewer === null || reviewer === void 0 ? void 0 : reviewer.following) || [] };
    }
    if (query.category) {
        matchStage.category = new mongoose_1.default.Types.ObjectId(query.category);
    }
    // Pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    // Sorting
    const sortStage = query.sortBy && query.sortOrder
        ? { [query.sortBy]: query.sortOrder === 'asc' ? 1 : -1 }
        : { createdAt: -1 };
    const pipeline = [
        { $match: matchStage },
        // Search
        ...(query.search
            ? [
                {
                    $match: {
                        description: { $regex: query.search, $options: 'i' },
                    },
                },
            ]
            : []),
        {
            $facet: {
                meta: [
                    { $count: 'total' },
                    {
                        $addFields: {
                            page,
                            limit,
                            totalPage: {
                                $ceil: { $divide: ['$total', limit] },
                            },
                        },
                    },
                ],
                result: [
                    { $sort: sortStage },
                    { $skip: skip },
                    { $limit: limit },
                    // Lookup product
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'product',
                            foreignField: '_id',
                            as: 'product',
                        },
                    },
                    { $unwind: '$product' },
                    // Lookup category
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'category',
                            foreignField: '_id',
                            as: 'category',
                        },
                    },
                    { $unwind: '$category' },
                    // Lookup reviewer
                    {
                        $lookup: {
                            from: 'reviewers',
                            localField: 'reviewer',
                            foreignField: '_id',
                            as: 'reviewer',
                        },
                    },
                    { $unwind: '$reviewer' },
                    // Lookup comments to count
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'review',
                            as: 'comments',
                        },
                    },
                    {
                        $addFields: {
                            totalComments: { $size: '$comments' },
                            isLike: {
                                $in: [new mongoose_1.Types.ObjectId(reviewerId), '$likers'],
                            },
                            isMyReview: {
                                $eq: ['$reviewer._id', new mongoose_1.Types.ObjectId(reviewerId)],
                            },
                            totalLikers: { $size: '$likers' },
                        },
                    },
                    {
                        $lookup: {
                            from: 'reviewers', // or users collection
                            let: { likerIds: '$likers' },
                            pipeline: [
                                { $match: { $expr: { $in: ['$_id', '$$likerIds'] } } },
                                { $sample: { size: 6 } }, // randomly pick up to 6 likers
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,
                                        username: 1,
                                        profile_image: 1,
                                    },
                                },
                            ],
                            as: 'likers',
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            reviewer: {
                                _id: 1,
                                name: 1,
                                username: 1,
                                profile_image: 1,
                            },
                            product: {
                                _id: 1,
                                name: 1,
                                price: 1,
                            },
                            category: {
                                _id: 1,
                                name: 1,
                            },
                            campaign: 1,
                            amount: 1,
                            description: 1,
                            images: 1,
                            video: 1,
                            thumbnail: 1,
                            totalLikers: 1,
                            rating: 1,
                            totalView: 1,
                            totalCommissions: 1,
                            totalReferralSales: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            totalComments: 1,
                            isLike: 1,
                            isMyReview: 1,
                            likers: 1,
                        },
                    },
                ],
            },
        },
    ];
    const result = yield reviewer_model_2.default.aggregate(pipeline);
    const meta = ((_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b[0]) || { page, limit, total: 0, totalPage: 0 };
    const reviews = ((_c = result[0]) === null || _c === void 0 ? void 0 : _c.result) || [];
    return {
        data: {
            meta,
            result: reviews,
        },
    };
});
// get my revies--------------------->>>>>
const getMyReviews = (reviewerId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewQuery = new QueryBuilder_1.default(reviewer_model_2.default.find({ reviewer: reviewerId })
        .populate({ path: 'product', select: 'name price' })
        .populate({ path: 'category', select: 'name' })
        .populate({ path: 'reviewer', select: 'name username profile_image' }), query)
        .search(['description'])
        .filter()
        .sort()
        .paginate()
        .fields();
    let reviews = yield reviewQuery.modelQuery;
    reviews = yield Promise.all(reviews.map((review) => __awaiter(void 0, void 0, void 0, function* () {
        const totalComments = yield comment_model_1.default.countDocuments({
            reviewId: review._id,
        });
        const isLike = review.likers.some((liker) => liker.equals(reviewerId));
        return Object.assign(Object.assign({}, review.toObject()), { totalComments,
            isLike });
    })));
    const meta = yield reviewQuery.countTotal();
    return {
        meta,
        result: reviews,
    };
});
// get all liker--------------------->>>>>>>>>>
const getReviewLikers = (reviewId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield reviewer_model_2.default.findById(reviewId).select('likers').lean();
    if (!review) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found');
    }
    const likerQuery = new QueryBuilder_1.default(reviewer_model_1.default.find({ _id: { $in: review.likers } }).select('name profile_image username'), query);
    const result = yield likerQuery.modelQuery;
    const meta = yield likerQuery.countTotal();
    return {
        meta,
        result,
    };
});
//
const likeUnlikeReview = (reviewId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield reviewer_model_2.default.findById(reviewId).select('likers');
        if (!review) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const alreadyLiked = review.likers.includes(userObjectId);
        const updatedReview = yield reviewer_model_2.default.findByIdAndUpdate(reviewId, alreadyLiked
            ? { $pull: { likers: userObjectId } }
            : { $push: { likers: userObjectId } }, { new: true }).select('likers');
        return {
            reviewId,
            liked: !alreadyLiked,
            totalLikes: updatedReview === null || updatedReview === void 0 ? void 0 : updatedReview.likers.length,
        };
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong while toggling like.');
    }
});
// get single product review-----
const getSingleProductReview = (productId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const resultQuery = new QueryBuilder_1.default(reviewer_model_2.default.find({ product: productId })
        .select('reviewer createdAt rating description')
        .populate({ path: 'reviewer', select: 'profile_image name' }), query)
        .search(['description'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield resultQuery.modelQuery;
    const meta = yield resultQuery.countTotal();
    const avgRatingData = yield reviewer_model_2.default.aggregate([
        { $match: { product: new mongoose_1.default.Types.ObjectId(productId) } },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
            },
        },
    ]);
    const averageRating = avgRatingData.length > 0 ? avgRatingData[0].averageRating : 0;
    return {
        meta,
        result,
        averageRating,
    };
});
const ReviewService = {
    createReview,
    getAllReviewFromDB,
    getReviewLikers,
    likeUnlikeReview,
    getMyReviews,
    getSingleProductReview,
};
exports.default = ReviewService;

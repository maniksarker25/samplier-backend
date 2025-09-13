"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enum_1 = require("../../utilities/enum");
const CampaignSchema = new mongoose_1.Schema({
    bussiness: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    amountForEachReview: {
        type: Number,
        required: true,
        min: 0,
    },
    numberOfReviewers: {
        type: Number,
        required: true,
        min: 1,
    },
    minAge: {
        type: Number,
        required: true,
        min: 1,
    },
    maxAge: {
        type: Number,
        required: true,
        min: 1,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    totalFee: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: Object.values(enum_1.ENUM_PAYMENT_METHOD),
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: Object.values(enum_1.ENUM_PAYMENT_STATUS),
        default: enum_1.ENUM_PAYMENT_STATUS.PENDING,
    },
    status: {
        type: String,
        enum: Object.values(enum_1.CAMPAIGN_STATUS),
        default: enum_1.CAMPAIGN_STATUS.ACTIVE,
    },
    paymentIntentId: {
        type: String,
    },
    totalBugget: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const Campaign = (0, mongoose_1.model)('Campaign', CampaignSchema);
exports.default = Campaign;

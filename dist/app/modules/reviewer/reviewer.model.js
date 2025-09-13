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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const enum_1 = require("../../utilities/enum");
const reviewer_constant_1 = require("./reviewer.constant");
const ReviewerSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    city: { type: String },
    zipcode: { type: Number },
    gender: { type: String, enum: Object.values(enum_1.GENDER) },
    age: { type: Number },
    ethnicity: { type: String, enum: Object.values(reviewer_constant_1.ethnicity) },
    educationLevel: { type: String, enum: Object.values(reviewer_constant_1.educationLevel) },
    maritalStatus: { type: String, enum: Object.values(reviewer_constant_1.maritalStatus) },
    employmentStatus: { type: String, enum: Object.values(reviewer_constant_1.employmentStatus) },
    householdIncome: { type: String, enum: Object.values(reviewer_constant_1.householdIncome) },
    familyAndDependents: {
        type: String,
        enum: Object.values(reviewer_constant_1.familyAndDependents),
    },
    interestedCategory: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Category',
            },
        ],
    },
    currentlyShareReview: [String],
    interestedCategoryStatus: {
        type: String,
        enum: Object.values(enum_1.INTEREST_STATUS),
        default: enum_1.INTEREST_STATUS.IN_PROGRESS,
    },
    currentShareReviewStatus: {
        type: String,
        enum: Object.values(enum_1.INTEREST_STATUS),
        default: enum_1.INTEREST_STATUS.IN_PROGRESS,
    },
    shippingInformationStatus: {
        type: String,
        enum: Object.values(enum_1.INTEREST_STATUS),
        default: enum_1.INTEREST_STATUS.IN_PROGRESS,
    },
    socailInfoStatus: {
        type: String,
        enum: Object.values(enum_1.INTEREST_STATUS),
        default: enum_1.INTEREST_STATUS.IN_PROGRESS,
    },
    profileDetailStatus: {
        type: String,
        enum: Object.values(enum_1.INTEREST_STATUS),
        default: enum_1.INTEREST_STATUS.IN_PROGRESS,
    },
    receiveProductBy: {
        type: String,
        enum: Object.values(reviewer_constant_1.receiveProductBy),
    },
    minPriceForReview: {
        type: Number,
        default: null,
    },
    maxPriceForReview: {
        type: Number,
        default: null,
    },
    isPersonalInfoProvided: {
        type: Boolean,
        default: false,
    },
    isAddressProvided: {
        type: Boolean,
        default: false,
    },
    profile_image: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
    },
    instagram: {
        type: String,
        default: '',
    },
    youtube: {
        type: String,
        default: '',
    },
    twitter: {
        type: String,
        default: '',
    },
    tiktok: {
        type: String,
        default: '',
    },
    whatsapp: {
        type: String,
        default: '',
    },
    facebook: {
        type: String,
        default: '',
    },
    blog: String,
    //
    totalEarning: {
        type: Number,
        default: 0,
    },
    currentBalance: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const Reviewer = mongoose_1.default.model('Reviewer', ReviewerSchema);
exports.default = Reviewer;

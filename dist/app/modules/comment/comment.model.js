"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    review: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Review',
        required: true,
    },
    commentor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true,
    },
    text: { type: String, required: true },
    image: { type: String, default: '' },
    likers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Reviewer' }],
    parent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
}, { timestamps: true });
commentSchema.index({ reviewId: 1, parentCommentId: 1, createdAt: -1 });
commentSchema.index({ likers: 1 });
const Comment = mongoose_1.default.model('Comment', commentSchema);
exports.default = Comment;

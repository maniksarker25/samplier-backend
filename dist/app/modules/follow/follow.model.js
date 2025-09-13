"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const followSchema = new mongoose_1.Schema({
    follower: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true,
    },
    following: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true,
    },
}, { timestamps: true });
followSchema.index({ follower: 1, following: 1 }, { unique: true });
const Follow = (0, mongoose_1.model)('Follow', followSchema);
exports.default = Follow;

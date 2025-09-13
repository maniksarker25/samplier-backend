"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSetting = void 0;
const mongoose_1 = require("mongoose");
const NotificationSettingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    pushNotification: { type: Boolean, default: true },
    mention: { type: Boolean, default: true },
    commentOnPost: { type: Boolean, default: true },
    likeOnPost: { type: Boolean, default: true },
    likeOnComment: { type: Boolean, default: true },
    newFollower: { type: Boolean, default: true },
    postYouFollow: { type: Boolean, default: true },
    trendingPost: { type: Boolean, default: true },
    newPost: { type: Boolean, default: true },
    postFromFollower: { type: Boolean, default: true },
}, { timestamps: true });
exports.NotificationSetting = (0, mongoose_1.model)('NotificationSetting', NotificationSettingSchema);

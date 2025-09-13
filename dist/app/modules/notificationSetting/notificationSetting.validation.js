"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const updateNotificationSettingSchema = zod_1.z.object({
    body: zod_1.z.object({
        pushNotification: zod_1.z.boolean().optional(),
        mention: zod_1.z.boolean().optional(),
        commentOnPost: zod_1.z.boolean().optional(),
        likeOnPost: zod_1.z.boolean().optional(),
        likeOnComment: zod_1.z.boolean().optional(),
        newFollower: zod_1.z.boolean().optional(),
        postYouFollow: zod_1.z.boolean().optional(),
        trendingPost: zod_1.z.boolean().optional(),
        newPost: zod_1.z.boolean().optional(),
        postFromFollower: zod_1.z.boolean().optional(),
    }),
});
const NoficationSettingValidations = {
    updateNotificationSettingSchema,
};
exports.default = NoficationSettingValidations;

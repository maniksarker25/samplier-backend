"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFollowData = void 0;
const zod_1 = require("zod");
exports.updateFollowData = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
});

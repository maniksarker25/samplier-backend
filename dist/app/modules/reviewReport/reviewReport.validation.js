"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const reviewReport_constant_1 = require("./reviewReport.constant");
const createReviewReportSchema = zod_1.z.object({
    body: zod_1.z.object({
        review: zod_1.z.string({ required_error: 'Review id is required' }),
        reportReason: zod_1.z.enum(Object.values(reviewReport_constant_1.REPORT_REASONS)),
        description: zod_1.z
            .string()
            .trim()
            .max(500, { message: 'Description cannot exceed 500 characters' })
            .optional(),
    }),
});
const ReviewReportValidations = {
    createReviewReportSchema,
};
exports.default = ReviewReportValidations;

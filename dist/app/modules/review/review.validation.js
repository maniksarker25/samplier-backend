"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
// Helper function to validate MongoDB ObjectId
const ObjectIdSchema = (fieldName) => zod_1.z
    .string({ required_error: `${fieldName} is required` })
    .min(1, `${fieldName} cannot be empty`)
    .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
    message: `${fieldName} must be a valid ObjectId`,
});
const reviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        campaignOfferId: ObjectIdSchema('Campaign Offer ID'),
        description: zod_1.z.string({ required_error: 'Description is required' }),
        rating: zod_1.z
            .number({
            required_error: 'Rating is required',
            invalid_type_error: 'Rating must be number',
        })
            .min(1, { message: 'Rating at list 1' })
            .max(5, { message: 'Max rating will be 5' }),
    }),
});
const ReviewValidation = {
    reviewValidationSchema,
};
exports.default = ReviewValidation;

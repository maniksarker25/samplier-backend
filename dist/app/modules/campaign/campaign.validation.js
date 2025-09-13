"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCampaignValidationSchema = exports.createCampaignValidationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const enum_1 = require("../../utilities/enum");
exports.createCampaignValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z
            .string({ required_error: 'Product id is required' })
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: 'Invalid product ID',
        }),
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(3, 'Name must be at least 3 characters')
            .max(100, 'Name must be less than 100 characters'),
        amountForEachReview: zod_1.z.number().min(0, 'Amount must be a positive number'),
        numberOfReviewers: zod_1.z.number().min(1, 'There must be at least one reviewer'),
        minAge: zod_1.z
            .number({ required_error: 'Min age is required' })
            .min(1, 'Min age musb be at least 1'),
        maxAge: zod_1.z
            .number({ required_error: 'Max age is required' })
            .min(1, 'Max age must be at least 1'),
        startDate: zod_1.z.preprocess((arg) => typeof arg === 'string' || arg instanceof Date
            ? new Date(arg)
            : undefined, zod_1.z.date().refine((date) => date >= new Date(), {
            message: 'Start date cannot be in the past',
        })),
        endDate: zod_1.z.preprocess((arg) => typeof arg === 'string' || arg instanceof Date
            ? new Date(arg)
            : undefined, zod_1.z.date()),
        gender: zod_1.z.enum(['male', 'female', 'other']),
        location: zod_1.z.string().min(1, 'Location is required'),
        paymentMethod: zod_1.z.enum(Object.values(enum_1.ENUM_PAYMENT_METHOD)),
    }),
});
exports.updateCampaignValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).optional(),
        minAge: zod_1.z.number().optional(),
        maxAge: zod_1.z.number().optional(),
        startDate: zod_1.z
            .preprocess((arg) => typeof arg === 'string' || arg instanceof Date
            ? new Date(arg)
            : undefined, zod_1.z.date().refine((date) => date >= new Date(), {
            message: 'Start date cannot be in the past',
        }))
            .optional(),
        endDate: zod_1.z
            .preprocess((arg) => typeof arg === 'string' || arg instanceof Date
            ? new Date(arg)
            : undefined, zod_1.z.date())
            .optional(),
        gender: zod_1.z.enum(['male', 'female', 'other']),
        location: zod_1.z.string().min(1, 'Location is required'),
    }),
});
const changeCampaignStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(Object.values(enum_1.CAMPAIGN_STATUS)),
    }),
});
const CampaignValidations = {
    createCampaignValidationSchema: exports.createCampaignValidationSchema,
    changeCampaignStatusValidationSchema,
    updateCampaignValidationSchema: exports.updateCampaignValidationSchema,
};
exports.default = CampaignValidations;

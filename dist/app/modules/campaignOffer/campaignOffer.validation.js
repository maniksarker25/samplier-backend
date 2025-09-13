"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
// Helper function to validate MongoDB ObjectId
const ObjectIdSchema = (fieldName) => zod_1.z
    .string({ required_error: `${fieldName} is required` })
    .min(1, `${fieldName} cannot be empty`)
    .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
    message: `${fieldName} must be a valid ObjectId`,
});
const campaignOfferSchema = zod_1.z.object({
    body: zod_1.z.object({
        campaign: ObjectIdSchema('Campaign ID'),
        product: ObjectIdSchema('Product ID'),
        business: ObjectIdSchema('Business ID'),
        shippingAddress: ObjectIdSchema('Shipping Address ID'),
        amount: zod_1.z.number().positive('Amount must be a positive number'),
    }),
});
const CampaignOfferValidations = {
    campaignOfferSchema,
};
exports.default = CampaignOfferValidations;

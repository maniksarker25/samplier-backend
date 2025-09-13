"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createStoreValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(1, 'Name is required'),
        company: zod_1.z
            .string({ required_error: 'Company is required' })
            .min(1, 'Company is required'),
        street1: zod_1.z
            .string({ required_error: 'Street1 is required' })
            .min(1, 'Street1 is required'),
        street2: zod_1.z.string().optional(),
        city: zod_1.z
            .string({ required_error: 'City is required' })
            .min(1, 'City is required'),
        state: zod_1.z
            .string({ required_error: 'State is required' })
            .min(1, 'State is required'),
        zip: zod_1.z
            .string({ required_error: 'ZIP is required' })
            .min(1, 'ZIP is required'),
        zipCode: zod_1.z.number().int().positive('Invalid zip code').optional(),
        country: zod_1.z
            .string({ required_error: 'Country is required' })
            .min(1, 'Country is required'),
        phone: zod_1.z
            .string({ required_error: 'Phone number is required' })
            .min(10, 'Phone number is required'),
        alternativePhoneNumber: zod_1.z
            .string({ required_error: 'Alternative phone number is required' })
            .min(10, 'Alternative phone number is required'),
        email: zod_1.z.string().email('Invalid email format').optional(),
        tagline: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
});
const updateStoreValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(1, 'Name is required')
            .optional(),
        company: zod_1.z
            .string({ required_error: 'Company is required' })
            .min(1, 'Company is required')
            .optional(),
        street1: zod_1.z
            .string({ required_error: 'Street1 is required' })
            .min(1, 'Street1 is required')
            .optional(),
        street2: zod_1.z.string().optional(),
        city: zod_1.z
            .string({ required_error: 'City is required' })
            .min(1, 'City is required')
            .optional(),
        state: zod_1.z
            .string({ required_error: 'State is required' })
            .min(1, 'State is required')
            .optional(),
        zip: zod_1.z
            .string({ required_error: 'ZIP is required' })
            .min(1, 'ZIP is required')
            .optional(),
        zipCode: zod_1.z.number().int().positive('Invalid zip code').optional(),
        country: zod_1.z
            .string({ required_error: 'Country is required' })
            .min(1, 'Country is required')
            .optional(),
        phone: zod_1.z
            .string({ required_error: 'Phone number is required' })
            .min(10, 'Phone number is required')
            .optional(),
        alternativePhoneNumber: zod_1.z
            .string({ required_error: 'Alternative phone number is required' })
            .min(10, 'Alternative phone number is required')
            .optional(),
        email: zod_1.z.string().email('Invalid email format').optional(),
        tagline: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
});
const StoreValidations = {
    createStoreValidationSchema,
    updateStoreValidationSchema,
};
exports.default = StoreValidations;

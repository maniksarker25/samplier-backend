"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const shippingAddressValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(1, 'Name is required'),
        company: zod_1.z
            .string({ required_error: 'Company is required' })
            .min(1, 'Company is required'),
        country: zod_1.z
            .string({ required_error: 'Country is required' })
            .min(1, 'Country is required'),
        zip: zod_1.z
            .string({ required_error: 'Zip is required' })
            .min(1, 'Zip is required'),
        city: zod_1.z
            .string({ required_error: 'City is required' })
            .min(1, 'City is required'),
        state: zod_1.z
            .string({ required_error: 'State is required' })
            .min(1, 'State is required'),
        phone: zod_1.z
            .string({ required_error: 'Phone is required' })
            .min(1, 'Phone is required'),
        email: zod_1.z.string().email('Invalid email address').optional(),
        alternativePhoneNumber: zod_1.z
            .string({ required_error: 'Alternative phone number is required' })
            .min(1, 'Alternative phone number is required'),
        street1: zod_1.z
            .string({ required_error: 'Street1 is required' })
            .min(1, 'Street1 is required'),
        street2: zod_1.z.string().optional(),
    }),
});
const updateShippingAddressValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).optional(),
        company: zod_1.z.string({ required_error: 'Company is required' }).optional(),
        country: zod_1.z.string({ required_error: 'Country is required' }).optional(),
        zip: zod_1.z.string({ required_error: 'Zip is required' }).optional(),
        city: zod_1.z.string({ required_error: 'City is required' }).optional(),
        state: zod_1.z.string({ required_error: 'State is required' }).optional(),
        phone: zod_1.z.string({ required_error: 'Phone is required' }).optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        alternativePhoneNumber: zod_1.z
            .string({ required_error: 'Alternative phone number is required' })
            .optional(),
        street1: zod_1.z.string({ required_error: 'Street1 is required' }).optional(),
        street2: zod_1.z.string().optional(),
    }),
});
const ShippingAddressValidations = {
    shippingAddressValidationSchema,
    updateShippingAddressValidationSchema,
};
exports.default = ShippingAddressValidations;

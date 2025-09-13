"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVariantValidationSchema = exports.createVariantValidationSchema = void 0;
const zod_1 = require("zod");
exports.createVariantValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        // sku: z.string().min(1, 'SKU is required'),
        color: zod_1.z.string().optional(),
        size: zod_1.z.string().optional(),
        weight: zod_1.z.string().optional(),
        price: zod_1.z.number().positive('Price must be greater than zero'),
        // stock: z.number().min(0, 'Stock cannot be negative').default(0),
        variantOption: zod_1.z.string({ required_error: 'Variant option is required' }),
        variantValue: zod_1.z.string({ required_error: 'Variant value is required' }),
        images: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updateVariantValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        sku: zod_1.z.string().min(1, 'SKU is required').optional(),
        color: zod_1.z.string().optional(),
        size: zod_1.z.string().optional(),
        weight: zod_1.z.string().optional(),
        price: zod_1.z.number().positive('Price must be greater than zero').optional(),
        // stock: z.number().min(0, 'Stock cannot be negative').default(0),
        images: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
const VariantValidations = {
    createVariantValidationSchema: exports.createVariantValidationSchema,
    updateVariantValidationSchema: exports.updateVariantValidationSchema,
};
exports.default = VariantValidations;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductValidationSchema = exports.createVariantValidationSchema = void 0;
const zod_1 = require("zod");
const enum_1 = require("../../utilities/enum");
exports.createVariantValidationSchema = zod_1.z.object({
    sku: zod_1.z.string().min(1, 'SKU is required'),
    color: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
    weight: zod_1.z.string().optional(),
    price: zod_1.z.number().positive('Price must be greater than zero'),
    stock: zod_1.z.number().min(0, 'Stock cannot be negative').default(0),
    images: zod_1.z.array(zod_1.z.string()).optional(),
});
const ProductStatusSchema = zod_1.z.nativeEnum(enum_1.ENUM_PRODUCT_STATUS);
exports.createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Product name is required' })
            .min(3, 'Product name must be at least 3 characters long'),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .min(10, 'Description must be at least 10 characters'),
        category: zod_1.z
            .string({ required_error: 'Category is required' })
            .min(1, 'Category ID is required'),
        brand: zod_1.z.string().optional(),
        status: ProductStatusSchema.default(enum_1.ENUM_PRODUCT_STATUS.ACTIVE),
        // variants: z
        //   .array(createVariantValidationSchema, {
        //     required_error: 'At least one variant is required',
        //   })
        //   .min(1, 'At least one variant is required'),
        tags: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    }),
});
const changeProductStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(Object.values(enum_1.ENUM_PRODUCT_STATUS)),
    }),
});
const saveAsDraftProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(3, 'Product name must be at least 3 characters long')
            .optional(),
        description: zod_1.z
            .string()
            .min(10, 'Description must be at least 10 characters')
            .optional(),
        category: zod_1.z.string().min(1, 'Category ID is required').optional(),
        brand: zod_1.z.string().optional(),
        status: ProductStatusSchema.default(enum_1.ENUM_PRODUCT_STATUS.ACTIVE),
        //   variants: z
        //     .array(variantSchema)
        //     .min(1, 'At least one variant is required')
        //     .optional(),
        tags: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    }),
});
const ProductValidations = {
    createProductValidationSchema: exports.createProductValidationSchema,
    saveAsDraftProductValidationSchema,
    changeProductStatusValidationSchema,
};
exports.default = ProductValidations;

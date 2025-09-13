"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Category name is required' })
            .min(1, 'Category name is required'),
        category_image: zod_1.z
            .string({
            required_error: 'Category image is required',
        })
            .optional(),
    }),
});
const updateCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Category name is required' })
            .min(1, 'Category name is required')
            .optional(),
        category_image: zod_1.z
            .string({
            required_error: 'Category image is required',
        })
            .optional(),
    }),
});
const categoryValidation = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
};
exports.default = categoryValidation;

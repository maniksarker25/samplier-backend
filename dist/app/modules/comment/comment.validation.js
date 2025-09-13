"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const ObjectIdSchema = (fieldName) => zod_1.z
    .string({ required_error: `${fieldName} is required` })
    .min(1, `${fieldName} cannot be empty`)
    .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
    message: `${fieldName} must be a valid ObjectId`,
});
const createCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        review: ObjectIdSchema('Review  id'),
        text: zod_1.z
            .string()
            .trim()
            .min(1, { message: 'Text is required' })
            .max(500, { message: 'Text cannot exceed 500 characters' }),
    }),
});
const updateCommentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z
            .string()
            .trim()
            .min(1, { message: 'Text is required' })
            .max(500, { message: 'Text cannot exceed 500 characters' })
            .optional(),
    }),
});
const createReplySchema = zod_1.z.object({
    body: zod_1.z.object({
        parent: ObjectIdSchema('Parent comment id'),
        text: zod_1.z
            .string()
            .trim()
            .min(1, { message: 'Text is required' })
            .max(500, { message: 'Text cannot exceed 500 characters' }),
    }),
});
const CommentValidations = {
    createCommentSchema,
    createReplySchema,
    updateCommentValidationSchema,
};
exports.default = CommentValidations;

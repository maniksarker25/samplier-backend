"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const addToCartValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        shopId: zod_1.z.string({ required_error: 'Shop id is required' }),
        productId: zod_1.z.string({ required_error: 'Product id is required' }),
        // price: z.number({ required_error: 'Price is required' }),
    }),
});
const removeCartItemValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string({ required_error: 'Product id is required' }),
    }),
});
const cartValidations = {
    addToCartValidationSchema,
    removeCartItemValidationSchema,
};
exports.default = cartValidations;

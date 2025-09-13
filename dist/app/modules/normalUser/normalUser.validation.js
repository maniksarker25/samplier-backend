"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNormalUserData = exports.createNormalUserSchema = void 0;
const zod_1 = require("zod");
exports.createNormalUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string({ required_error: 'Password is required' })
            .min(6, { message: 'Password must be 6 character' }),
        confirmPassword: zod_1.z
            .string({ required_error: 'Confirm password is required' })
            .min(6, { message: 'Password must be 6 character' }),
        userData: zod_1.z.object({
            name: zod_1.z.string().nonempty('Name is required'),
            phone: zod_1.z.string().optional(),
            email: zod_1.z.string().email('Invalid email format'),
            address: zod_1.z.string().nonempty('Address is required').optional(),
        }),
    }),
});
exports.updateNormalUserData = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty('Name is required').optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
});
const normalUserValidations = {
    createNormalUserSchema: exports.createNormalUserSchema,
    updateNormalUserData: exports.updateNormalUserData,
};
exports.default = normalUserValidations;

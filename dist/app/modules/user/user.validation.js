"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBussinessOwnerValidationSchema = void 0;
const zod_1 = require("zod");
const enum_1 = require("../../utilities/enum");
// Zod schema for user creation
exports.registerBussinessOwnerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ invalid_type_error: 'Please add a valid email' })
            .email('Invalid email format')
            .optional(),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
// register for reviewer
const registerReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be string',
        }),
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({ required_error: 'Old password is required' }),
        newPassword: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
// refresh token validation schema -----------
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh token is required' }),
    }),
});
// forget password validation schema
const forgetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'User email is required' }),
    }),
});
// reset password validation schema
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'User email is required' }),
        newPassword: zod_1.z.string({ required_error: 'New password is required' }),
    }),
});
const verifyCodeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }),
        verifyCode: zod_1.z.number({ required_error: 'Verify code  is required' }),
    }),
});
const resendVerifyCodeSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }),
    }),
});
const changeUserStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(Object.values(enum_1.ENUM_USER_STATUS)),
    }),
});
const deleteUserAccountValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const userValidations = {
    registerBussinessOwnerValidationSchema: exports.registerBussinessOwnerValidationSchema,
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
    verifyCodeValidationSchema,
    resendVerifyCodeSchema,
    changeUserStatus,
    deleteUserAccountValidationSchema,
    registerReviewValidationSchema,
};
exports.default = userValidations;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSuperAdminSchema = void 0;
const zod_1 = require("zod");
exports.updateSuperAdminSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty('Name is required').optional(),
    username: zod_1.z.string().nonempty('Username is required').optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .nonempty('Email is required')
        .optional(),
    address: zod_1.z.string().optional(),
    profile_image: zod_1.z.string().optional().default(''),
});
const superAdminValidations = {
    updateSuperAdminSchema: exports.updateSuperAdminSchema,
};
exports.default = superAdminValidations;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createComplianceInfoValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        contactName: zod_1.z.string().min(1, 'Contact name is required'),
        contactRole: zod_1.z.string().min(1, 'Contact role is required'),
        phoneNumber: zod_1.z.string().min(1, 'Phone number is required'),
    }),
});
const updateComplianceInfoValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        contactName: zod_1.z.string().min(1, 'Contact name is required').optional(),
        contactRole: zod_1.z.string().min(1, 'Contact role is required').optional(),
        phoneNumber: zod_1.z.string().min(1, 'Phone number is required').optional(),
    }),
});
const complicanceInfoValidations = {
    createComplianceInfoValidationSchema,
    updateComplianceInfoValidationSchema,
};
exports.default = complicanceInfoValidations;

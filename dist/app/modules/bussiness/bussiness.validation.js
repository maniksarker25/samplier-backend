"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const bussiness_constant_1 = require("./bussiness.constant");
const addBussinessInfoValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        bussinessName: zod_1.z.string().min(1, 'Business name is required'),
        email: zod_1.z.string().email('Please use a valid email address'),
        tradeName: zod_1.z.string().min(1, 'Trade name is required'),
        bussinessType: zod_1.z.enum(Object.values(bussiness_constant_1.bussinessType)),
        industryType: zod_1.z.enum(Object.values(bussiness_constant_1.industryType)),
        bussinessAddress: zod_1.z.string().min(1, 'Business address is required'),
        phoneNumber: zod_1.z.string().min(1, 'Phone number is required'),
        website: zod_1.z.string().url('Please use a valid website URL'),
        taxtIndentificationNumber: zod_1.z
            .number()
            .int('Tax Identification Number must be an integer')
            .positive('Tax Identification Number must be positive'),
    }),
});
const addBussinessDocumentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        einNumber: zod_1.z.number({
            required_error: 'Ein number is required',
            invalid_type_error: 'Ein number must be number',
        }),
        incorporationCertificate: zod_1.z
            .string({
            required_error: 'Incorporation certificate is required',
            invalid_type_error: 'Incorporation certificate must be string',
        })
            .optional(),
        bussinessLicense: zod_1.z
            .string({
            required_error: 'Bussiness license is required',
            invalid_type_error: 'Bussiness license must be string',
        })
            .optional(),
    }),
});
const bussinessValidations = {
    addBussinessInfoValidationSchema,
    addBussinessDocumentValidationSchema,
};
exports.default = bussinessValidations;

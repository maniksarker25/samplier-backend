"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const reviewer_constant_1 = require("./reviewer.constant");
const enum_1 = require("../../utilities/enum");
const addAddressValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        city: zod_1.z
            .string()
            .min(3, 'City must be at least 3 characters long')
            .nonempty('City is required'),
        zipCode: zod_1.z
            .string()
            .min(5, 'Zip Code must be at least 5 characters long')
            .nonempty('Zip Code is required'),
        gender: zod_1.z.string().nonempty('Gender is required'),
        age: zod_1.z
            .number()
            .min(18, 'Age must be at least 18')
            .max(100, 'Age must be less than 100')
            .int('Age must be a valid number'),
    }),
});
const addPersonalInfoValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        ethnicity: zod_1.z
            .enum(Object.values(reviewer_constant_1.ethnicity))
            .optional(),
        educationLevel: zod_1.z
            .enum(Object.values(reviewer_constant_1.educationLevel))
            .optional(),
        maritalStatus: zod_1.z
            .enum(Object.values(reviewer_constant_1.maritalStatus))
            .optional(),
        employmentStatus: zod_1.z
            .enum(Object.values(reviewer_constant_1.employmentStatus))
            .optional(),
        householdIncome: zod_1.z
            .enum(Object.values(reviewer_constant_1.householdIncome))
            .optional(),
        familyAndDependents: zod_1.z
            .enum(Object.values(reviewer_constant_1.familyAndDependents))
            .optional(),
    }),
});
const addInterestedCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        interestedCategory: zod_1.z.array(zod_1.z.string()),
    }),
});
const addCurrentlyShareReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentlyShareReview: zod_1.z.array(zod_1.z.string()),
    }),
});
const updateReviewerValidationSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    username: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    zipcode: zod_1.z.number().optional(),
    gender: zod_1.z.enum(Object.values(enum_1.GENDER)),
    age: zod_1.z.number().min(18, 'Age must be at least 18').optional(),
    ethnicity: zod_1.z
        .enum(Object.values(reviewer_constant_1.ethnicity))
        .optional(),
    educationLevel: zod_1.z
        .enum(Object.values(reviewer_constant_1.educationLevel))
        .optional(),
    maritalStatus: zod_1.z
        .enum(Object.values(reviewer_constant_1.maritalStatus))
        .optional(),
    employmentStatus: zod_1.z
        .enum(Object.values(reviewer_constant_1.employmentStatus))
        .optional(),
    householdIncome: zod_1.z
        .enum(Object.values(reviewer_constant_1.householdIncome))
        .optional(),
    familyAndDependents: zod_1.z
        .enum(Object.values(reviewer_constant_1.familyAndDependents))
        .optional(),
    interestedCategory: zod_1.z
        .array(zod_1.z.string().min(24, 'Category ID must be a valid ObjectId'))
        .optional(), // Array of valid ObjectId references
    currentlyShareReview: zod_1.z.array(zod_1.z.string()).optional(),
    interestedCategoryStatus: zod_1.z
        .enum(Object.values(enum_1.INTEREST_STATUS))
        .optional(),
    currentShareReviewStatus: zod_1.z
        .enum(Object.values(enum_1.INTEREST_STATUS))
        .optional(),
    shippingInformationStatus: zod_1.z
        .enum(Object.values(enum_1.INTEREST_STATUS))
        .optional(),
    socailInfoStatus: zod_1.z
        .enum(Object.values(enum_1.INTEREST_STATUS))
        .optional(),
    profileDetailStatus: zod_1.z
        .enum(Object.values(enum_1.INTEREST_STATUS))
        .optional(),
    isPersonalInfoProvided: zod_1.z.boolean().default(false),
    isAddressProvided: zod_1.z.boolean().default(false),
    profile_image: zod_1.z.string().default(''),
    bio: zod_1.z.string().optional(),
    instagram: zod_1.z.string().optional(),
    youtube: zod_1.z.string().optional(),
    twitter: zod_1.z.string().optional(),
    tiktok: zod_1.z.string().optional(),
    whatsapp: zod_1.z.string().optional(),
    facebook: zod_1.z.string().optional(),
    blog: zod_1.z.string().optional(),
    minPriceForReview: zod_1.z.number().optional(),
    maxPriceForReview: zod_1.z.number().optional(),
    receiveProductBy: zod_1.z.enum(Object.values(reviewer_constant_1.receiveProductBy)),
});
const makeSkipValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        skipValue: zod_1.z.enum(Object.values(enum_1.ENUM_SKIP_VALUE)),
    }),
});
const ReviewerValidations = {
    addAddressValidationSchema,
    addPersonalInfoValidationSchema,
    addInterestedCategoryValidation,
    addCurrentlyShareReviewValidationSchema,
    updateReviewerValidationSchema,
    makeSkipValidationSchema,
};
exports.default = ReviewerValidations;

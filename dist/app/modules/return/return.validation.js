"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnValidations = void 0;
const zod_1 = require("zod");
const return_enum_1 = require("./return.enum");
const mongoose_1 = __importDefault(require("mongoose"));
const OrderItemZodSchema = zod_1.z.object({
    product: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: 'Invalid product ID format',
    }),
    variant: zod_1.z.string().optional(),
    quantity: zod_1.z.number().min(1, 'Quantity must be at least 1').int(),
    price: zod_1.z.number().min(0, 'Price must be a positive number'),
    referral: zod_1.z
        .object({
        reviewerId: zod_1.z.string().optional(),
        reviewId: zod_1.z.string().optional(),
        amount: zod_1.z.number().optional().nullable(),
    })
        .optional(),
});
const returnValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        business: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
            message: 'Invalid business ID format',
        }),
        items: zod_1.z.array(OrderItemZodSchema).nonempty('Items array cannot be empty'),
        orderId: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
            message: 'Invalid order ID format',
        }),
        transactionId: zod_1.z.string().nonempty('Transaction ID is required'),
        totalReturnAmount: zod_1.z.number().optional(),
        returnMethod: zod_1.z.enum(Object.values(return_enum_1.ENUM_RETURN_METHOD)),
        status: zod_1.z.enum(Object.values(return_enum_1.ENUM_RETURN_STATUS)),
        refundTransactionId: zod_1.z.string().nullable().optional(),
        refundDate: zod_1.z.date().nullable().optional(),
    }),
});
exports.returnValidations = {
    returnValidationSchema,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const enum_1 = require("../../utilities/enum");
const createOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        shippingAddress: zod_1.z
            .string({ required_error: `Shipping address is required` })
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: `Shipping address must be a valid ObjectId`,
        }),
        paymentMethod: zod_1.z.enum(Object.values(enum_1.ENUM_PAYMENT_METHOD)),
    }),
});
const OrderValidations = {
    createOrderValidationSchema,
};
exports.default = OrderValidations;

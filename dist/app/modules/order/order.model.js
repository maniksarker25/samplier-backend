"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderItemSchema = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../utilities/enum");
exports.OrderItemSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Variant', default: null },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    referral: {
        reviewerId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Reviewer',
        },
        reviewId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Review',
        },
        amount: {
            type: Number,
        },
    },
});
const OrderSchema = new mongoose_1.Schema({
    reviewer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Reviewer', required: true },
    bussiness: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Bussiness',
        required: true,
    },
    shippingAddress: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'ShippingAddress',
    },
    items: { type: [exports.OrderItemSchema], required: true },
    totalQuantity: { type: Number, required: true, min: 1 },
    subTotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    paymentMethod: {
        type: String,
        enum: Object.values(enum_1.ENUM_PAYMENT_METHOD),
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: Object.values(enum_1.ENUM_PAYMENT_STATUS),
        default: enum_1.ENUM_PAYMENT_STATUS.PENDING,
        required: true,
    },
    deliveryStatus: {
        type: String,
        enum: Object.values(enum_1.ENUM_DELIVERY_STATUS),
        default: enum_1.ENUM_DELIVERY_STATUS.waiting,
        required: true,
    },
    isReferralAmountPaid: {
        type: Boolean,
        default: false,
    },
    shipping: {
        rateId: { type: String, required: false },
        provider: { type: String, required: false },
        service: { type: String, required: false },
        amount: { type: Number, required: false, default: 0 },
        currency: { type: String, required: false },
        shipmentId: { type: String, required: false },
        status: { type: String, default: 'PENDING' }, // PENDING until shipped
        trackingNumber: { type: String, default: null },
        labelUrl: { type: String, default: '' },
    },
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);

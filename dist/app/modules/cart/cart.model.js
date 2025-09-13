"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// cart.model.ts
const mongoose_1 = require("mongoose");
const cart_constaint_1 = require("./cart.constaint");
const CartSchema = new mongoose_1.Schema({
    reviewer: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Reviewer',
    },
    bussiness: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Bussiness',
    },
    items: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            variant: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Variant',
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            },
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
        },
    ],
    totalQuantity: {
        type: Number,
        default: 0,
    },
    subTotal: {
        type: Number,
        default: 0,
    },
    deliveryFee: {
        type: Number,
        default: 0,
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Pre-save middleware to calculate totalQuantity and totalPrice
CartSchema.pre('save', function (next) {
    this.totalQuantity = this.items.reduce((acc, item) => acc + item.quantity, 0);
    this.subTotal = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    this.deliveryFee = cart_constaint_1.deliveryFee;
    this.totalPrice = Number((this.subTotal + cart_constaint_1.deliveryFee).toFixed(2));
    next();
});
const Cart = (0, mongoose_1.model)('Cart', CartSchema);
exports.default = Cart;

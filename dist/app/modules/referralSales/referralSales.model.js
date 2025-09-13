"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const referralSalesSchema = new mongoose_1.Schema({
    review: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Review',
        required: true,
    },
    reviewer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    bussiness: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Bussiness',
    },
    commision: {
        type: Number,
        required: true,
    },
    buyer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true,
    },
});
const ReferralSales = (0, mongoose_1.model)('ReferralSales', referralSalesSchema);
exports.default = ReferralSales;

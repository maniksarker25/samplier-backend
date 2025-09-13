"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enum_1 = require("../../utilities/enum");
const TransactionSchema = new mongoose_1.Schema({
    paymentSender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    item: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: Object.values(enum_1.ENUM_TRANSACTION_STATUS),
        required: true,
    },
    transactionId: { type: String, unique: true, required: true },
    paymentReceiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, { timestamps: true });
const Transaction = (0, mongoose_1.model)('Transaction', TransactionSchema);
exports.default = Transaction;

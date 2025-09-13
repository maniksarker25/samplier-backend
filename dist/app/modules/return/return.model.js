"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const return_enum_1 = require("./return.enum"); // Enum imports
const enum_1 = require("../../utilities/enum");
const order_model_1 = require("../order/order.model");
// Define the schema for IReturn model
const returnSchema = new mongoose_1.Schema({
    bussiness: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: enum_1.ENUM_REF_TYPE.BUSSINESS,
        required: true,
    },
    reviewer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: enum_1.ENUM_REF_TYPE.REVIEWER,
        required: true,
    },
    items: { type: [order_model_1.OrderItemSchema], required: true },
    orderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: enum_1.ENUM_REF_TYPE.ORDER,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    totalReturnAmount: {
        type: Number,
    },
    returnMethod: {
        type: String,
        enum: Object.values(return_enum_1.ENUM_RETURN_METHOD),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(return_enum_1.ENUM_RETURN_STATUS),
        required: true,
    },
    refundTransactionId: {
        type: String,
        default: null,
    },
    refundDate: {
        type: Date,
        default: null,
    },
    returnReason: {
        type: String,
    },
}, {
    timestamps: true,
});
const Return = mongoose_1.default.model('Return', returnSchema);
exports.default = Return;

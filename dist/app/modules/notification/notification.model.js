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
const enum_1 = require("../../utilities/enum");
const notification_enum_1 = require("./notification.enum");
const NotificationSchema = new mongoose_1.Schema({
    receiver: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'senderType',
        required: false,
    },
    senderType: {
        type: String,
        enum: Object.values(enum_1.ENUM_SENDER_TYPE),
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(notification_enum_1.ENUM_NOTIFICATION_TYPE),
        required: true,
    },
    message: { type: String, required: true },
    data: {
        commentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' },
        orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' },
        reviewId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Review' },
        amount: { type: Number },
        product: {
            id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String },
            quantity: { type: Number },
        },
    },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
NotificationSchema.index({ receiver: 1, isRead: 1, createdAt: -1 });
const Notification = mongoose_1.default.model('Notification', NotificationSchema);
exports.default = Notification;

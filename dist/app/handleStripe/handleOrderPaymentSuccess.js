"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../error/appError"));
const order_model_1 = require("../modules/order/order.model");
const enum_1 = require("../utilities/enum");
const reviewer_model_1 = __importDefault(require("../modules/reviewer/reviewer.model"));
const reviewer_model_2 = __importDefault(require("../modules/review/reviewer.model"));
const handleOrderPaymentSuccess = (orderId, transactionId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Order not found , Payment is completed but order is not created so please contact with support');
    }
    yield order_model_1.Order.findByIdAndUpdate(orderId, {
        paymentStatus: enum_1.ENUM_PAYMENT_STATUS.SUCCESS,
    });
    const referralPromises = order.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        if (item.referral) {
            // Update reviewer balance
            const reviewerUpdatePromise = reviewer_model_1.default.findByIdAndUpdate(item.referral.reviewerId, {
                $inc: {
                    totalEarning: item.referral.amount,
                    currentBalance: item.referral.amount,
                },
            });
            // Update review
            const reviewUpdatePromise = reviewer_model_2.default.findByIdAndUpdate(item.referral.reviewId, {
                $inc: {
                    totalReferralSales: 1,
                    totalCommissions: item.referral.amount,
                },
            });
            yield Promise.all([reviewerUpdatePromise, reviewUpdatePromise]);
        }
    }));
    yield Promise.all(referralPromises);
    // TODO: create transaction
});
exports.default = handleOrderPaymentSuccess;

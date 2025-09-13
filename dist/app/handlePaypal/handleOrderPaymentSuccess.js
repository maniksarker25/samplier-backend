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
const order_model_1 = require("../modules/order/order.model");
const enum_1 = require("../utilities/enum");
const config_1 = __importDefault(require("../config"));
const handleOrderPaymentSuccess = (req, res, orderId, transactionId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield order_model_1.Order.findByIdAndUpdate(orderId, {
        paymentStatus: enum_1.ENUM_PAYMENT_STATUS.SUCCESS,
    });
    // TODO: create transaction
    // then rediract
    return res.redirect(`${config_1.default.stripe.stripe_order_payment_success_url}?orderId=${orderId}&transaction_id=${transactionId}&amount=${amount}`);
});
exports.default = handleOrderPaymentSuccess;

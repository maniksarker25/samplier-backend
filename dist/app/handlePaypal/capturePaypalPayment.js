"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// export default capturePayPalPayment;
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
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const enum_1 = require("../utilities/enum");
const paypal_1 = __importDefault(require("../utilities/paypal"));
const handleCampaignPaymentSuccess_1 = __importDefault(require("./handleCampaignPaymentSuccess"));
const handleOrderPaymentSuccess_1 = __importDefault(require("./handleOrderPaymentSuccess"));
const capturePayPalPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.query.token;
    try {
        const captureRequest = new checkout_server_sdk_1.default.orders.OrdersCaptureRequest(orderId);
        captureRequest.requestBody({});
        const captureResponse = yield paypal_1.default.execute(captureRequest);
        if (captureResponse.result.status !== 'COMPLETED') {
            console.error('Payment Capture Failed:', captureResponse);
            return res.redirect(`${process.env.PAYPAL_CANCEL_URL}`);
        }
        const orderRequest = new checkout_server_sdk_1.default.orders.OrdersGetRequest(orderId);
        const orderResponse = yield paypal_1.default.execute(orderRequest);
        const purchaseUnit = orderResponse.result.purchase_units[0];
        const id = purchaseUnit.custom_id || 'UNKNOWN_CAMPAIGN';
        const paymentPurpose = purchaseUnit.reference_id || 'UNKNOWN_PURPOSE';
        const transactionId = captureResponse.result.id;
        const amount = purchaseUnit.amount.value;
        if (paymentPurpose === enum_1.ENUM_PAYMENT_PURPOSE.ORDER) {
            yield (0, handleOrderPaymentSuccess_1.default)(req, res, id, transactionId, amount);
        }
        else if (paymentPurpose === enum_1.ENUM_PAYMENT_PURPOSE.CAMPAIGN_RUN) {
            yield (0, handleCampaignPaymentSuccess_1.default)(req, res, id, transactionId, amount);
        }
    }
    catch (error) {
        console.error('PayPal Capture Error:', error);
        return res.redirect(`${process.env.PAYPAL_CANCEL_URL}`);
    }
});
exports.default = capturePayPalPayment;

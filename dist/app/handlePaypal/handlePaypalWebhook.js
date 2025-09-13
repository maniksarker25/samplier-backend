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
const handlePaypalPaymentSuccess_1 = __importDefault(require("./handlePaypalPaymentSuccess"));
const handlePaypalWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = req.body;
    console.log('📌 Received PayPal Webhook Event: ', event.event_type);
    try {
        switch (event.event_type) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                yield (0, handlePaypalPaymentSuccess_1.default)(event.resource);
                console.log('paypal complted');
                break;
            case 'PAYMENT.CAPTURE.DENIED':
                // await handlePaymentFailure(event.resource);
                console.log('payment capture denied');
                break;
            case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED':
                // await handlePayoutSuccess(event.resource);
                console.log('paymetn payuts item success');
                break;
            case 'PAYMENT.PAYOUTS-ITEM.DENIED':
                // await handlePayoutFailure(event.resource);
                console.log('payment payouts deined');
                break;
            case 'PAYMENT.SALE.REFUNDED':
                // await handleRefund(event.resource);
                console.log('payment sale refunded');
                break;
            default:
                console.log(`🚨 Unhandled Event: ${event.event_type}`);
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.error('❌ Webhook Handling Error: ', error);
        res.sendStatus(500);
    }
});
exports.default = handlePaypalWebhook;

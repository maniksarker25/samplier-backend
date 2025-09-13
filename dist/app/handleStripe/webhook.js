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
/* eslint-disable @typescript-eslint/no-explicit-any */
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../config"));
const handlePaymentSuccess_1 = __importDefault(require("./handlePaymentSuccess"));
const stripe = new stripe_1.default(config_1.default.stripe.stripe_secret_key);
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const endpointSecret = config_1.default.stripe.webhook_endpoint_secret;
    const sig = req.headers['stripe-signature'];
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        // Handle different event types
        switch (event.type) {
            //   case 'payment_intent.succeeded': {
            //     const paymentIntent = event.data.object as Stripe.PaymentIntent;
            //     console.log(paymentIntent.metadata);
            //     const { userId, paymentPurpose } = paymentIntent.metadata;
            //     console.log(
            //       `Payment successful for user ${userId}, subscription ${userId}`,
            //     );
            //     // await handlePaymentSuccess(userId, paymentPurpose);
            //     // Update subscription status in your database
            //     break;
            //   }
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log(session.metadata);
                const paymentIntentId = session.payment_intent;
                const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
                yield (0, handlePaymentSuccess_1.default)(session.metadata, paymentIntent.id, paymentIntent.amount / 100);
                break;
            }
            case 'account.updated': {
                const account = event.data.object;
                if (account.details_submitted) {
                    try {
                        // await stripeServices.updateClientStripeConnectionStatus(account.id);
                    }
                    catch (err) {
                        console.error(`Failed to update client status for Stripe account ID: ${account.id}`, err);
                    }
                }
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const { userId, subscriptionId } = paymentIntent.metadata;
                console.log(`Payment failed for user ${userId}, subscription ${subscriptionId}`);
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).send('Success');
    }
    catch (err) {
        console.error('Webhook error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
exports.default = handleWebhook;

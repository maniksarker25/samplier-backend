"use strict";
// import Stripe from 'stripe';
// import config from '../config';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../config"));
// const stripe = new Stripe(config.stripe.stripe_secret_key as string, {
//   apiVersion: '2024-09-30.acacia',
// });
// export default stripe;
const stripe = new stripe_1.default(config_1.default.stripe.stripe_secret_key, {
    apiVersion: '2025-02-24.acacia', // Correct version
});
exports.default = stripe;

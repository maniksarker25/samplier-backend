"use strict";
// import paypal from 'paypal-rest-sdk';
// import config from '../config';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// interface PayPalConfig {
//   mode: 'sandbox' | 'live';
//   client_id: string;
//   client_secret: string;
// }
// console.log(config.paypal.client_id);
// const paypalConfig: PayPalConfig = {
//   mode: (config.paypal.mode as 'sandbox' | 'live') || 'sandbox',
//   client_id: config.paypal.client_id || '',
//   client_secret: config.paypal.client_secret || '',
// };
// if (!paypalConfig.client_id || !paypalConfig.client_secret) {
//   throw new Error(
//     '🚨 PayPal Client ID or Secret is missing from environment variables.',
//   );
// }
// paypal.configure(paypalConfig);
// export default paypal;
// import paypal from '@paypal/checkout-server-sdk';
// import config from '../config';
// const environment =
//   config.paypal.mode === 'live'
//     ? new paypal.core.LiveEnvironment(
//         config.paypal.client_id as string,
//         config.paypal.client_secret as string,
//       )
//     : new paypal.core.SandboxEnvironment(
//         config.paypal.client_id as string,
//         config.paypal.client_secret as string,
//       );
// const paypalClient = new paypal.core.PayPalHttpClient(environment);
// export default paypalClient;
const checkout_server_sdk_1 = require("@paypal/checkout-server-sdk");
const config_1 = __importDefault(require("../config"));
// Set up PayPal environment
const environment = config_1.default.paypal.mode === 'live'
    ? new checkout_server_sdk_1.core.LiveEnvironment(config_1.default.paypal.client_id, config_1.default.paypal.client_secret)
    : new checkout_server_sdk_1.core.SandboxEnvironment(config_1.default.paypal.client_id, config_1.default.paypal.client_secret);
const paypalClient = new checkout_server_sdk_1.core.PayPalHttpClient(environment);
exports.default = paypalClient;

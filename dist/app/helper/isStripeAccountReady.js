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
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../config"));
/* eslint-disable @typescript-eslint/no-explicit-any */
const stripe = new stripe_1.default(config_1.default.stripe.stripe_secret_key);
const isStripeAccountReady = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield stripe.accounts.retrieve(accountId);
        const { capabilities, requirements } = account;
        // const isCardPaymentsActive = capabilities?.card_payments === 'active';
        const isTransfersActive = (capabilities === null || capabilities === void 0 ? void 0 : capabilities.transfers) === 'active';
        const currentlyDue = (requirements === null || requirements === void 0 ? void 0 : requirements.currently_due) || [];
        console.log('currently due', currentlyDue);
        // const isReady =
        //   //   isCardPaymentsActive && isTransfersActive && currentlyDue.length === 0;
        //   isCardPaymentsActive && isTransfersActive;
        const isReady = isTransfersActive;
        return isReady;
    }
    catch (error) {
        console.error(`Failed to check account ${accountId}:`, error.message);
        return false;
    }
});
exports.default = isStripeAccountReady;

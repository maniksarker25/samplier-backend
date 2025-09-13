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
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const stripe_1 = __importDefault(require("../../utilities/stripe"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const createConnectedAccountAndOnboardingLink = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield user_model_1.User.findById(userData.id);
    if (!userInfo) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (userInfo === null || userInfo === void 0 ? void 0 : userInfo.isStripeAccountConnected) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Stripe is already connected');
    }
    const account = yield stripe_1.default.accounts.create({
        type: 'express',
        email: userInfo.email,
        country: 'US',
        capabilities: {
            // card_payments: { requested: true },
            transfers: { requested: true },
        },
        settings: {
            payouts: {
                schedule: {
                    interval: 'manual',
                },
            },
        },
    });
    const updateUserData = yield user_model_1.User.findByIdAndUpdate(userData.id, {
        stripeConnectedAccountId: account === null || account === void 0 ? void 0 : account.id,
    });
    if (!updateUserData) {
        throw new appError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Unable to add account id in user data');
    }
    const onboardingLink = yield stripe_1.default.accountLinks.create({
        account: account.id,
        refresh_url: `${config_1.default.stripe.onboarding_refresh_url}?accountId=${account === null || account === void 0 ? void 0 : account.id}`,
        return_url: `${config_1.default.stripe.onboarding_return_url}`,
        type: 'account_onboarding',
    });
    return onboardingLink.url;
});
const updateOnboardingLink = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Shop not found');
    }
    const accountLink = yield stripe_1.default.accountLinks.create({
        account: user.stripeConnectedAccountId,
        refresh_url: `${config_1.default.stripe.onboarding_refresh_url}?accountId=${user.stripeConnectedAccountId}`,
        return_url: config_1.default.stripe.onboarding_return_url,
        type: 'account_onboarding',
    });
    return { link: accountLink.url };
});
const StripeService = {
    createConnectedAccountAndOnboardingLink,
    updateOnboardingLink,
};
exports.default = StripeService;

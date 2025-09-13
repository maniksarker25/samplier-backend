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
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const getAccessToken_1 = __importDefault(require("../../handlePaypal/getAccessToken"));
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../error/appError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const createOnboardingLinkForPartnerAccount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    try {
        const accessToken = yield (0, getAccessToken_1.default)();
        console.log('Access token:', accessToken);
        const response = yield axios_1.default.post(`${config_1.default.paypal.base_url}/v2/customer/partner-referrals`, {
            operations: [
                {
                    operation: 'API_INTEGRATION',
                    api_integration_preference: {
                        rest_api_integration: {
                            integration_method: 'PAYPAL',
                            integration_type: 'THIRD_PARTY',
                        },
                    },
                },
            ],
            products: ['PAYOUTS'],
            legal_consents: [
                {
                    type: 'SHARE_DATA_CONSENT',
                    granted: true,
                },
            ],
            partner_config_override: {
                return_url: `https://yourwebsite.com/onboarding-success?userId=${userId}`,
                show_add_credit_card: false,
            },
            tracking_id: userId,
            requested_capabilities: ['PAYOUTS'],
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        // console.log('PayPal Response:', response.data);
        const onboardingLink = (_a = response.data.links.find((link) => link.rel === 'action_url')) === null || _a === void 0 ? void 0 : _a.href;
        if (!onboardingLink) {
            throw new appError_1.default(http_status_1.default.NO_CONTENT, 'Failed to generate onboarding link');
        }
        return {
            link: onboardingLink,
        };
    }
    catch (error) {
        console.error('Error creating onboarding link for PayPal partner:', error);
        if (error.response) {
            console.error('PayPal API Error:', error.response.data);
        }
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
});
// save paypal account
const savePaypalAccount = (merchantId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!merchantId || !userId) {
        throw new appError_1.default(http_status_1.default.MISDIRECTED_REQUEST, 'Missing parametter , failed to connect partner account');
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(userId, { paypalMerchantId: merchantId, isPaypalConnected: true }, { new: true, runValidators: true });
    return result;
});
const PaypalService = {
    createOnboardingLinkForPartnerAccount,
    savePaypalAccount,
};
exports.default = PaypalService;

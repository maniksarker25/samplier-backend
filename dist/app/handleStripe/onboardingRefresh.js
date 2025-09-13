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
const config_1 = __importDefault(require("../config"));
const appError_1 = __importDefault(require("../error/appError"));
const stripe_1 = __importDefault(require("../utilities/stripe"));
const onboardingRefresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountId } = req.query;
        if (!accountId) {
            return res.status(400).send('Missing accountId');
        }
        const accountLink = yield stripe_1.default.accountLinks.create({
            account: accountId,
            refresh_url: `${config_1.default.stripe.onboarding_refresh_url}?accountId=${accountId}`,
            return_url: config_1.default.stripe.onboarding_return_url,
            type: 'account_onboarding',
        });
        res.redirect(accountLink.url);
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Update onboarding link failed');
    }
});
exports.default = onboardingRefresh;

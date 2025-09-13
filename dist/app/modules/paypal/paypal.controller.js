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
const catchasync_1 = __importDefault(require("../../utilities/catchasync"));
const sendResponse_1 = __importDefault(require("../../utilities/sendResponse"));
const paypal_service_1 = __importDefault(require("./paypal.service"));
const config_1 = __importDefault(require("../../config"));
const createOnboardingLinkForPaypalPartner = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield paypal_service_1.default.createOnboardingLinkForPartnerAccount(req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Link created successfully',
        data: result,
    });
}));
const savePaypalAccount = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield paypal_service_1.default.savePaypalAccount(req.query.merchantId, req.query.userId);
    if (!result) {
        return res.redirect(`${config_1.default.paypal.paypal_onboarding_success}`);
    }
    return res.redirect(`${config_1.default.paypal.paypal_onboarding_failed}`);
}));
const PaypalController = {
    createOnboardingLinkForPaypalPartner,
    savePaypalAccount,
};
exports.default = PaypalController;

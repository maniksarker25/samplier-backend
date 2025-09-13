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
const campaign_model_1 = __importDefault(require("../modules/campaign/campaign.model"));
const enum_1 = require("../utilities/enum");
const handleCampaignRunPaymentSuccess = (req, res, campaignId, transactionId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield campaign_model_1.default.findByIdAndUpdate(campaignId, {
        paymentStatus: enum_1.ENUM_PAYMENT_STATUS.SUCCESS,
    });
    return res.redirect(`${process.env.PAYPAL_SUCCESS_URL}?campaign_id=${campaignId}&transaction_id=${transactionId}&amount=${amount}`);
});
exports.default = handleCampaignRunPaymentSuccess;

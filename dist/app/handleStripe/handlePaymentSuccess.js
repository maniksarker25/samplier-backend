"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
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
const appError_1 = __importDefault(require("../error/appError"));
const campaign_model_1 = __importDefault(require("../modules/campaign/campaign.model"));
const enum_1 = require("../utilities/enum");
const transaction_model_1 = __importDefault(require("../modules/transaction/transaction.model"));
const handleOrderPaymentSuccess_1 = __importDefault(require("./handleOrderPaymentSuccess"));
const handlePaymentSuccess = (metaData, transactionId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(transactionId, amount);
    if (metaData.paymentPurpose == enum_1.ENUM_PAYMENT_PURPOSE.CAMPAIGN_RUN) {
        console.log('payment purpucse');
        yield handleCampaignRunPaymentSuccess(metaData.campaignId, transactionId, amount);
    }
    else if (metaData.paymentPurpose == enum_1.ENUM_PAYMENT_PURPOSE.ORDER) {
        yield (0, handleOrderPaymentSuccess_1.default)(metaData.orderId, transactionId, amount);
    }
});
const handleCampaignRunPaymentSuccess = (campaignId, transactionId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(campaignId, transactionId, amount);
    const campaign = yield campaign_model_1.default.findOne({
        _id: campaignId,
        paymentStatus: enum_1.ENUM_PAYMENT_STATUS.PENDING,
    });
    if (!campaign) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Pending campaign not found');
    }
    // update campaign
    yield campaign_model_1.default.findByIdAndUpdate(campaignId, {
        paymentStatus: enum_1.ENUM_PAYMENT_STATUS.SUCCESS,
        paymentIntentId: transactionId,
    }, { new: true, runValidators: true });
    // create transaction
    yield transaction_model_1.default.create({
        item: 'Campaign run payment',
        amount,
        paymentSender: campaign.bussiness,
        transactionId,
        status: enum_1.ENUM_TRANSACTION_STATUS.SUCCESS,
    });
});
exports.default = handlePaymentSuccess;

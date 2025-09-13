"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignOffer = void 0;
const mongoose_1 = require("mongoose");
const campaignOffer_constant_1 = require("./campaignOffer.constant");
const enum_1 = require("../../utilities/enum");
const CampaignOfferSchema = new mongoose_1.Schema({
    campaign: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    business: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Bussiness', required: true },
    reviewer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Reviewer', required: true },
    shippingAddress: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ShippingAddress',
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(campaignOffer_constant_1.CampaignOfferStatus),
        required: true,
        default: campaignOffer_constant_1.CampaignOfferStatus.accept,
    },
    deliveryStatus: {
        type: String,
        enum: Object.values(enum_1.ENUM_DELIVERY_STATUS),
        required: true,
        default: enum_1.ENUM_DELIVERY_STATUS.waiting,
    },
    amount: { type: Number, required: true },
}, { timestamps: true });
exports.CampaignOffer = (0, mongoose_1.model)('CampaignOffer', CampaignOfferSchema);

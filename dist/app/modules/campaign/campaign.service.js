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
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const http_status_1 = __importDefault(require("http-status"));
const node_cron_1 = __importDefault(require("node-cron"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const constant_1 = require("../../constant");
const appError_1 = __importDefault(require("../../error/appError"));
const enum_1 = require("../../utilities/enum");
const paypal_1 = __importDefault(require("../../utilities/paypal"));
const stripe_1 = __importDefault(require("../../utilities/stripe"));
const product_model_1 = __importDefault(require("../product/product.model"));
const user_constant_1 = require("../user/user.constant");
const campaign_model_1 = __importDefault(require("./campaign.model"));
const createCampaign = (bussinessId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const product = yield product_model_1.default.findById(payload.product);
    const reviewCost = payload.amountForEachReview * payload.numberOfReviewers;
    const adminFee = (reviewCost * constant_1.platformFeeForCampaignParcentage) / 100;
    const totalAmount = reviewCost + adminFee;
    const amountInCents = totalAmount * 100;
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    if (product.status !== enum_1.ENUM_PRODUCT_STATUS.ACTIVE) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Need to chose a active product for campaign');
    }
    // Check if campaign is scheduled
    const currentDate = new Date();
    if (currentDate < new Date(payload.startDate)) {
        payload.status = enum_1.CAMPAIGN_STATUS.SCHEDULED;
    }
    // Create campaign in DB (without payment yet)
    const result = yield campaign_model_1.default.create(Object.assign(Object.assign({}, payload), { totalFee: totalAmount, bussiness: bussinessId, totalBugget: reviewCost }));
    if (payload.paymentMethod === enum_1.ENUM_PAYMENT_METHOD.STRIPE) {
        // Handle Stripe Payment
        const session = yield stripe_1.default.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Campaign Run' },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                campaignId: result._id.toString(),
                paymentPurpose: enum_1.ENUM_PAYMENT_PURPOSE.CAMPAIGN_RUN,
            },
            success_url: config_1.default.stripe.stripe_campaign_run_payment_success_url,
            cancel_url: config_1.default.stripe.stripe_campaign_run_payment_cancel_url,
        });
        return { url: session.url };
    }
    if (payload.paymentMethod === enum_1.ENUM_PAYMENT_METHOD.PAYPAL) {
        try {
            const request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
            request.prefer('return=representation');
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: totalAmount.toFixed(2),
                        },
                        description: `Payment for Campaign: ${result._id}`,
                        custom_id: result._id.toString(),
                        reference_id: enum_1.ENUM_PAYMENT_PURPOSE.CAMPAIGN_RUN,
                    },
                ],
                application_context: {
                    brand_name: 'Your Business Name',
                    landing_page: 'LOGIN',
                    user_action: 'PAY_NOW',
                    return_url: `${config_1.default.paypal.payment_capture_url}`,
                    cancel_url: `${config_1.default.paypal.paypal_campaign_run_payment_cancel_url}`,
                },
            });
            const response = yield paypal_1.default.execute(request);
            const approvalUrl = (_a = response.result.links.find((link) => link.rel === 'approve')) === null || _a === void 0 ? void 0 : _a.href;
            if (!approvalUrl) {
                throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'PayPal payment creation failed: No approval URL found');
            }
            return { url: approvalUrl };
        }
        catch (error) {
            console.error('PayPal Payment Error:', error);
            throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create PayPal order');
        }
    }
});
// update campaign
const updateCampaignIntoDB = (bussinessId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const campaign = yield campaign_model_1.default.findOne({ bussiness: bussinessId, _id: id });
    if (!campaign) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Campaign not found');
    }
    if (campaign.status === enum_1.CAMPAIGN_STATUS.CANCELLED) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Your can't edit cancelled campaign");
    }
    if (payload.startDate && payload.endDate) {
        if (new Date(payload.startDate) > new Date(payload.endDate)) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Start date can not be grater then end date');
        }
    }
    else if (payload.startDate) {
        if (new Date(payload.startDate) > campaign.endDate) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Start date can not be grater then end date');
        }
        if (new Date(payload.startDate) > new Date()) {
            payload.status = enum_1.CAMPAIGN_STATUS.SCHEDULED;
        }
    }
    else if (payload.endDate) {
        if (new Date(payload.endDate) < campaign.startDate) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'End date can not be less then start date');
        }
    }
    const result = yield campaign_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// get campaigns
const getAllCampaignFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const campaignQuery = new QueryBuilder_1.default(campaign_model_1.default.find({ paymentStatus: enum_1.ENUM_PAYMENT_STATUS.SUCCESS }).populate('product'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield campaignQuery.countTotal();
    const result = yield campaignQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getMyCampaigns = (profileId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const campaignQuery = new QueryBuilder_1.default(campaign_model_1.default.find({
        paymentStatus: enum_1.ENUM_PAYMENT_STATUS.SUCCESS,
        bussiness: profileId,
    }).populate('product'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield campaignQuery.countTotal();
    const result = yield campaignQuery.modelQuery;
    return {
        meta,
        result,
    };
});
// get single campaign
// TODO : need to work for bussiness owner for get campaign overview
const getSingleCampaignFromDB = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    if ((userData === null || userData === void 0 ? void 0 : userData.role) === user_constant_1.USER_ROLE.bussinessOwner) {
        const result = yield campaign_model_1.default.findOne({
            _id: id,
            bussiness: userData === null || userData === void 0 ? void 0 : userData.profileId,
        }).populate('product');
        return result;
    }
    else {
        const result = yield campaign_model_1.default.findById(id).populate('product');
        return result;
    }
});
// change campaign status
const changeCampaignStatus = (bussinessId, id, status) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if (status === enum_1.CAMPAIGN_STATUS.PAUSED) {
        result = yield pauseCampaign(bussinessId, id, status);
    }
    else if (status === enum_1.CAMPAIGN_STATUS.CANCELLED) {
        result = yield cancelCampaign(bussinessId, id, status);
    }
    else if (status === enum_1.CAMPAIGN_STATUS.ACTIVE) {
        result = yield makeCampaignActive(bussinessId, id, status);
    }
    return result;
});
const pauseCampaign = (bussinessId, id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const campaign = yield campaign_model_1.default.findOne({ _id: id, bussiness: bussinessId });
    if (!campaign) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Campaign not found');
    }
    const result = yield campaign_model_1.default.findByIdAndUpdate(id, { status: status }, { new: true, runValidators: true });
    return result;
});
const makeCampaignActive = (bussinessId, id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const campaign = yield campaign_model_1.default.findOne({ _id: id, bussiness: bussinessId });
    if (!campaign) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Campaign not found');
    }
    if (new Date() > (campaign === null || campaign === void 0 ? void 0 : campaign.endDate)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Your campaign end date is expired please update end date then make active');
    }
    if (!campaign) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Campaign not found');
    }
    const result = yield campaign_model_1.default.findByIdAndUpdate(id, { status: status }, { new: true, runValidators: true });
    return result;
});
// chancel campaign--------------------------------
const cancelCampaign = (bussinessId, id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const campaign = yield campaign_model_1.default.findOne({ _id: id, bussiness: bussinessId });
    if (!campaign) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Campaign not found');
    }
    //TODO: need to do database operation with review
    const totalReviewCount = 10;
    const amountForEachReview = campaign.amountForEachReview;
    const totalSpent = totalReviewCount * amountForEachReview;
    const refundAmount = campaign.totalBugget - totalSpent;
    if (campaign.paymentMethod === enum_1.ENUM_PAYMENT_METHOD.STRIPE) {
        if (!campaign.paymentIntentId) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'No payment intent found for this campaign');
        }
        try {
            const refund = yield stripe_1.default.refunds.create({
                payment_intent: campaign.paymentIntentId,
                amount: Math.round(refundAmount * 100),
            });
            console.log('Refund successful:', refund.id);
            const result = yield campaign_model_1.default.findByIdAndUpdate(id, { status: status }, { new: true, runValidators: true });
            return result;
            return refund;
        }
        catch (error) {
            console.error('Stripe refund error:', error);
            throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to process refund');
        }
    }
    else if (campaign.paymentMethod === enum_1.ENUM_PAYMENT_METHOD.PAYPAL) {
        //TODO: paypal refund need
        console.log('paypal refund');
    }
});
// crone jobs for campaign --------------------
node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Cron job executed at:', new Date());
    const currentDate = new Date();
    const result = yield campaign_model_1.default.updateMany({ startDate: { $lte: currentDate }, status: { $ne: 'Active' } }, { $set: { status: 'Active' } });
    const result2 = yield campaign_model_1.default.updateMany({
        endDate: { $lte: currentDate },
    }, { $set: { status: enum_1.CAMPAIGN_STATUS.EXPIRED } });
    console.log(`Campaigns updated to active: ${result.modifiedCount}`);
    console.log(`Campaigns updated to expired: ${result2.modifiedCount}`);
}));
const CampaignService = {
    createCampaign,
    getAllCampaignFromDB,
    changeCampaignStatus,
    getSingleCampaignFromDB,
    updateCampaignIntoDB,
    getMyCampaigns,
};
exports.default = CampaignService;

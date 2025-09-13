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
const campaignOffer_model_1 = require("./campaignOffer.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_constant_1 = require("../user/user.constant");
const acceptCampaignOffer = (profileId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const campaignOffer = yield campaignOffer_model_1.CampaignOffer.findOne({
        reviewer: profileId,
        campaign: payload.campaign,
    });
    if (campaignOffer) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'You already accept this offer');
    }
    const result = yield campaignOffer_model_1.CampaignOffer.create(Object.assign(Object.assign({}, payload), { reviewer: profileId }));
    return result;
});
// get my campaign offer
const getMyCampaignOfferFromDB = (userData, query) => __awaiter(void 0, void 0, void 0, function* () {
    let filterQuery = {};
    if ((userData === null || userData === void 0 ? void 0 : userData.role) === user_constant_1.USER_ROLE.reviewer) {
        filterQuery = {
            reveviewer: userData.profileId,
        };
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === user_constant_1.USER_ROLE.bussinessOwner) {
        filterQuery = {
            bussiness: userData === null || userData === void 0 ? void 0 : userData.profileId,
        };
    }
    const campaignOfferQuery = new QueryBuilder_1.default(campaignOffer_model_1.CampaignOffer.find(filterQuery)
        .populate({
        path: 'campaign',
        select: 'name amountForEachReview endDate',
    })
        .populate({ path: 'product', select: 'name images' }), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield campaignOfferQuery.modelQuery;
    const meta = yield campaignOfferQuery.countTotal();
    return {
        meta,
        result,
    };
});
const CampaignOfferService = {
    acceptCampaignOffer,
    getMyCampaignOfferFromDB,
};
exports.default = CampaignOfferService;

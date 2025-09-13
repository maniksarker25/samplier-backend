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
const enum_1 = require("../../utilities/enum");
const sendResponse_1 = __importDefault(require("../../utilities/sendResponse"));
const campaign_service_1 = __importDefault(require("./campaign.service"));
const createCampaign = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_service_1.default.createCampaign(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Campaign created successfully`,
        data: result,
    });
}));
const updateCampaign = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_service_1.default.updateCampaignIntoDB(req.user.profileId, req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Campaign updated successfully`,
        data: result,
    });
}));
const getAllCampaign = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_service_1.default.getAllCampaignFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Campaign retrieved successfully`,
        data: result,
    });
}));
const getMyCampaigns = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_service_1.default.getMyCampaigns(req.user.profileId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Campaign retrieved successfully`,
        data: result,
    });
}));
// change campaign status -------------------------
const changeCampaignStatus = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_service_1.default.changeCampaignStatus(req.user.profileId, req.params.id, req.body.status);
    let resMessage;
    if ((result === null || result === void 0 ? void 0 : result.status) === enum_1.CAMPAIGN_STATUS.CANCELLED) {
        resMessage =
            'Campaign cancel successfully and you got refund the rest of amount from bugget';
    }
    else if ((result === null || result === void 0 ? void 0 : result.status) === enum_1.CAMPAIGN_STATUS.PAUSED) {
        resMessage = 'Campaign paused successfully';
    }
    else if ((result === null || result === void 0 ? void 0 : result.status) === enum_1.CAMPAIGN_STATUS.ACTIVE) {
        resMessage = 'Campaign activate successfully';
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: resMessage,
        data: result,
    });
}));
const getSingleCampaign = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_service_1.default.getSingleCampaignFromDB(req.params.id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Campaign retrived successfully`,
        data: result,
    });
}));
const CampaignController = {
    createCampaign,
    getAllCampaign,
    changeCampaignStatus,
    getSingleCampaign,
    updateCampaign,
    getMyCampaigns,
};
exports.default = CampaignController;

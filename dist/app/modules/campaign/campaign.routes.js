"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const simpleAuth_1 = __importDefault(require("../../middlewares/simpleAuth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const campaign_controller_1 = __importDefault(require("./campaign.controller"));
const campaign_validation_1 = __importDefault(require("./campaign.validation"));
const router = express_1.default.Router();
router.post('/create-campaign', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, validateRequest_1.default)(campaign_validation_1.default.createCampaignValidationSchema), campaign_controller_1.default.createCampaign);
router.patch('/update-campaign/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), campaign_controller_1.default.updateCampaign);
router.get('/get-campaign', 
// auth(USER_ROLE.sampler, USER_ROLE.sampler),
campaign_controller_1.default.getAllCampaign);
router.get('/get-my-campaigns', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), campaign_controller_1.default.getMyCampaigns);
router.patch('/change-status/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, validateRequest_1.default)(campaign_validation_1.default.changeCampaignStatusValidationSchema), campaign_controller_1.default.changeCampaignStatus);
router.get('/get-single-campaign/:id', simpleAuth_1.default, campaign_controller_1.default.getSingleCampaign);
exports.campaignRoutes = router;

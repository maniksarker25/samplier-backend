"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignOfferRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const campaignOffer_controller_1 = __importDefault(require("./campaignOffer.controller"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const campaignOffer_validation_1 = __importDefault(require("./campaignOffer.validation"));
const router = express_1.default.Router();
router.post('/accept-campaign-offer', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(campaignOffer_validation_1.default.campaignOfferSchema), campaignOffer_controller_1.default.acceptCampaignOffer);
router.get('/get-my-campaign-offer', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), campaignOffer_controller_1.default.getMyCampaignOffer);
exports.campaignOfferRoutes = router;

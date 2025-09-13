"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paypalRoutes = void 0;
const express_1 = __importDefault(require("express"));
const paypal_controller_1 = __importDefault(require("./paypal.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post('/create-onboarding-link', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner, user_constant_1.USER_ROLE.reviewer), paypal_controller_1.default.createOnboardingLinkForPaypalPartner);
router.get('/onboarding-success', paypal_controller_1.default.savePaypalAccount);
exports.paypalRoutes = router;

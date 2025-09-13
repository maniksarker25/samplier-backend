"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.referralSalesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const referralSales_controller_1 = __importDefault(require("./referralSales.controller"));
const router = express_1.default.Router();
router.get('/get-referral-sales', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner, user_constant_1.USER_ROLE.reviewer), referralSales_controller_1.default.getReferralSales);
exports.referralSalesRoutes = router;

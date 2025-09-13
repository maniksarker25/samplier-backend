"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("./user.constant");
const user_controller_1 = __importDefault(require("./user.controller"));
const user_validation_1 = __importDefault(require("./user.validation"));
const router = (0, express_1.Router)();
router.post('/register-bussiness', (0, validateRequest_1.default)(user_validation_1.default.registerBussinessOwnerValidationSchema), user_controller_1.default.registerUser);
router.post('/register-reviewer', (0, validateRequest_1.default)(user_validation_1.default.registerReviewValidationSchema), user_controller_1.default.registerReviewer);
router.post('/verify-code', (0, validateRequest_1.default)(user_validation_1.default.verifyCodeValidationSchema), user_controller_1.default.verifyCode);
router.post('/resend-verify-code', (0, validateRequest_1.default)(user_validation_1.default.resendVerifyCodeSchema), user_controller_1.default.resendVerifyCode);
router.patch('/block-unblock/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), user_controller_1.default.changeUserStatus);
exports.userRoutes = router;

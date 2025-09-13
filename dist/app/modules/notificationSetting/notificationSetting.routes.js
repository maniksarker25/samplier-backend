"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSettingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const notificationSetting_controller_1 = __importDefault(require("./notificationSetting.controller"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const notificationSetting_validation_1 = __importDefault(require("./notificationSetting.validation"));
const router = express_1.default.Router();
router.patch('/update-notification-setting', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner, user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(notificationSetting_validation_1.default.updateNotificationSettingSchema), notificationSetting_controller_1.default.updateNotificationSetting);
router.get('/get-notification-setting', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer, user_constant_1.USER_ROLE.bussinessOwner), notificationSetting_controller_1.default.getNotificationSetting);
exports.notificationSettingRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalUserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const normalUser_validation_1 = __importDefault(require("./normalUser.validation"));
const normalUser_controller_1 = __importDefault(require("./normalUser.controller"));
const fileUploader_1 = require("../../helper/fileUploader");
const router = express_1.default.Router();
router.patch('/update-profile', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, fileUploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(normalUser_validation_1.default.updateNormalUserData), normalUser_controller_1.default.updateUserProfile);
exports.normalUserRoutes = router;

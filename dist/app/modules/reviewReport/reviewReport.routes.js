"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewReportRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const reviewReport_controller_1 = __importDefault(require("./reviewReport.controller"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const reviewReport_validation_1 = __importDefault(require("./reviewReport.validation"));
const router = express_1.default.Router();
router.post('/create-report', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(reviewReport_validation_1.default.createReviewReportSchema), reviewReport_controller_1.default.createReviewReport);
exports.reviewReportRoutes = router;

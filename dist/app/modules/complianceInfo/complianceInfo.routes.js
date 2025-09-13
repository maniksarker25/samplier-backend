"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.complianceInfoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const complianceInfo_controller_1 = __importDefault(require("./complianceInfo.controller"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const complianceInfo_validation_1 = __importDefault(require("./complianceInfo.validation"));
const router = express_1.default.Router();
router.post('/create-compliance-info', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, validateRequest_1.default)(complianceInfo_validation_1.default.createComplianceInfoValidationSchema), complianceInfo_controller_1.default.createComplianceInfo);
router.patch('/update-compliance-info/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, validateRequest_1.default)(complianceInfo_validation_1.default.updateComplianceInfoValidationSchema), complianceInfo_controller_1.default.updateComplianceInfo);
router.delete('/delete-compliance-info/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), complianceInfo_controller_1.default.deleteComplianceInfo);
router.get('/get-compliance-info-for-bussiness/:id', complianceInfo_controller_1.default.getComplianceInfoForBussiness);
exports.complianceInfoRoutes = router;

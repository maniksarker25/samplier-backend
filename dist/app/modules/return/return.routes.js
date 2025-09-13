"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const return_validation_1 = require("./return.validation");
const return_controller_1 = __importDefault(require("./return.controller"));
const router = express_1.default.Router();
router.post('/create-return', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(return_validation_1.returnValidations.returnValidationSchema), return_controller_1.default.createReturn);
router.get('/all-return', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer, user_constant_1.USER_ROLE.bussinessOwner), return_controller_1.default.getAllReturn);
router.patch('/issue-refund/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), return_controller_1.default.issueRefund);
exports.returnRoutes = router;

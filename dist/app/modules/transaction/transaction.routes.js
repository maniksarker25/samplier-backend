"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const transaction_controller_1 = __importDefault(require("./transaction.controller"));
const router = express_1.default.Router();
router.get('/get-all-transaction', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), transaction_controller_1.default.getAllTransaction);
router.get('/get-my-transaction', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner, user_constant_1.USER_ROLE.reviewer), transaction_controller_1.default.getMyTransaction);
exports.transactionRoutes = router;

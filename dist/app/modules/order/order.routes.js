"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const order_controller_1 = __importDefault(require("./order.controller"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_validation_1 = __importDefault(require("./order.validation"));
const router = express_1.default.Router();
router.post('/create-order', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(order_validation_1.default.createOrderValidationSchema), order_controller_1.default.createOrder);
router.get('/get-my-orders', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer, user_constant_1.USER_ROLE.bussinessOwner), order_controller_1.default.getMyOrders);
exports.orderRoutes = router;

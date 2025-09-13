"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingAddressRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const shippingAddress_validation_1 = __importDefault(require("./shippingAddress.validation"));
const shippingAddress_controller_1 = __importDefault(require("./shippingAddress.controller"));
const router = express_1.default.Router();
router.post('/create-shipping-address', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(shippingAddress_validation_1.default.shippingAddressValidationSchema), shippingAddress_controller_1.default.createShippingAddress);
router.patch('/update-shipping-address/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(shippingAddress_validation_1.default.updateShippingAddressValidationSchema), shippingAddress_controller_1.default.updateShippingAddress);
router.get('/get-shipping-address', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), shippingAddress_controller_1.default.getShippingAddress);
exports.shippingAddressRoutes = router;

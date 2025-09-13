"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const cart_controller_1 = __importDefault(require("./cart.controller"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const cart_validation_1 = __importDefault(require("./cart.validation"));
const router = express_1.default.Router();
router.post('/add-to-cart', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), 
// validateRequest(cartValidations.addToCartValidationSchema),
cart_controller_1.default.addToCart);
router.patch('/remove-cart-item', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(cart_validation_1.default.removeCartItemValidationSchema), cart_controller_1.default.removeCartItem);
router.get('/view-cart', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), cart_controller_1.default.viewCart);
router.patch('/increase-item-quantity', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(cart_validation_1.default.removeCartItemValidationSchema), cart_controller_1.default.increaseItemQuantity);
router.patch('/decrease-item-quantity', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(cart_validation_1.default.removeCartItemValidationSchema), cart_controller_1.default.decreaseItemQuantity);
router.delete('/delete-cart', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), cart_controller_1.default.clearCart);
exports.cartRoutes = router;

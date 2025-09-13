"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const shippo_controller_1 = __importDefault(require("./shippo.controller"));
const router = express_1.default.Router();
router.post('/get-shipping-methods', shippo_controller_1.default.getShippingMethods);
router.post('/get-shipping-rates', shippo_controller_1.default.getShippingRatesForCheckout);
exports.shippoRoutes = router;

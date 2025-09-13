"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const catchasync_1 = __importDefault(require("../../utilities/catchasync"));
const sendResponse_1 = __importDefault(require("../../utilities/sendResponse"));
const shippingAddress_service_1 = __importDefault(require("./shippingAddress.service"));
const createShippingAddress = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('user', req.user);
    const result = yield shippingAddress_service_1.default.createShippingAddress(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Shipping address added successfully',
        data: result,
    });
}));
const updateShippingAddress = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shippingAddress_service_1.default.updateShippingAddress(req.user.profileId, req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Shipping address updated successfully',
        data: result,
    });
}));
const getShippingAddress = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shippingAddress_service_1.default.getShippingAddress(req.user.profileId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Shipping address retrieved successfully',
        data: result,
    });
}));
const ShippingAddressController = {
    createShippingAddress,
    updateShippingAddress,
    getShippingAddress,
};
exports.default = ShippingAddressController;

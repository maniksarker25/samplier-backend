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
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const shippo_1 = require("shippo");
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../error/appError"));
const shippingAddress_model_1 = __importDefault(require("./shippingAddress.model"));
const shippo = new shippo_1.Shippo({ apiKeyHeader: config_1.default.shippo.api_key });
// crate shipping address
const createShippingAddress = (reviewerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validatedAddress = yield shippo.addresses.create(Object.assign(Object.assign({}, payload), { validate: true }));
    // Ensure validation_results exists
    if (!validatedAddress.validationResults ||
        validatedAddress.validationResults.isValid !== true) {
        const messages = ((_a = validatedAddress.validationResults) === null || _a === void 0 ? void 0 : _a.messages) || [];
        const errorText = messages.map((m) => m.text).join('; ') ||
            'Invalid or undeliverable address provided.';
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, errorText);
    }
    const result = yield shippingAddress_model_1.default.create(Object.assign(Object.assign({}, payload), { reviewer: reviewerId }));
    return result;
});
const updateShippingAddress = (reviewerId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const shippingAddress = yield shippingAddress_model_1.default.findOne({
        reviewer: reviewerId,
        _id: id,
    });
    if (!shippingAddress) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Shipping address not found');
    }
    const validatedAddress = yield shippo.addresses.create(Object.assign(Object.assign({}, payload), { validate: true }));
    // Ensure validation_results exists
    if (!validatedAddress.validationResults ||
        validatedAddress.validationResults.isValid !== true) {
        const messages = ((_a = validatedAddress.validationResults) === null || _a === void 0 ? void 0 : _a.messages) || [];
        const errorText = messages.map((m) => m.text).join('; ') ||
            'Invalid or undeliverable address provided.';
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, errorText);
    }
    const result = yield shippingAddress_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const getShippingAddress = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shippingAddress_model_1.default.find({ reviewer: profileId });
    return result;
});
const ShippingAddressService = {
    createShippingAddress,
    updateShippingAddress,
    getShippingAddress,
};
exports.default = ShippingAddressService;

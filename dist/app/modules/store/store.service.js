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
const appError_1 = __importDefault(require("../../error/appError"));
const shippo_1 = __importDefault(require("../../utilities/shippo"));
const bussiness_model_1 = __importDefault(require("../bussiness/bussiness.model"));
const store_model_1 = require("./store.model");
const createStore = (profileId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bussiness = yield bussiness_model_1.default.findById(profileId);
    if (!bussiness) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Bussiness not found');
    }
    const validatedAddress = yield shippo_1.default.addresses.create(Object.assign(Object.assign({}, payload), { validate: true }));
    if (!validatedAddress.validationResults ||
        validatedAddress.validationResults.isValid !== true) {
        const messages = ((_a = validatedAddress.validationResults) === null || _a === void 0 ? void 0 : _a.messages) || [];
        const errorText = messages.map((m) => m.text).join('; ') ||
            'Invalid or undeliverable address provided.';
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, errorText);
    }
    const result = yield store_model_1.Store.create(Object.assign(Object.assign({}, payload), { bussiness: profileId }));
    return result;
});
const updateStoreIntoDB = (profileId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const store = yield store_model_1.Store.findOne({ bussiness: profileId, _id: id });
    if (!store) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Store not found');
    }
    const validatedAddress = yield shippo_1.default.addresses.create(Object.assign(Object.assign({}, payload), { validate: true }));
    if (!validatedAddress.validationResults ||
        validatedAddress.validationResults.isValid !== true) {
        const messages = ((_a = validatedAddress.validationResults) === null || _a === void 0 ? void 0 : _a.messages) || [];
        const errorText = messages.map((m) => m.text).join('; ') ||
            'Invalid or undeliverable address provided.';
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, errorText);
    }
    const result = yield store_model_1.Store.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const getBussinessStore = (bussinessId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield store_model_1.Store.find({ bussiness: bussinessId });
    return result;
});
const StoreService = {
    createStore,
    updateStoreIntoDB,
    getBussinessStore,
};
exports.default = StoreService;

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
const appError_1 = __importDefault(require("../../error/appError"));
const product_model_1 = __importDefault(require("../product/product.model"));
const variant_model_1 = __importDefault(require("./variant.model"));
const createVariantIntoDB = (profileId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(payload.product);
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Product not found that you provided ');
    }
    const result = yield variant_model_1.default.create(Object.assign(Object.assign({}, payload), { bussiness: profileId }));
    return result;
});
const updateVariantIntoDB = (profileId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const variant = yield variant_model_1.default.findOne({ bussiness: profileId, _id: id });
    if (!variant) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Variant not found');
    }
    const result = yield variant_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    console.log('result', result);
    return result;
});
const deleteVarintFromDB = (profileId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const variant = yield variant_model_1.default.findOne({ bussiness: profileId, _id: id });
    if (!variant) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Variant not found');
    }
    const result = yield variant_model_1.default.findByIdAndDelete(id);
    return result;
});
const getProductVariant = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield variant_model_1.default.find({ product: productId });
    return result;
});
const VariantService = {
    createVariantIntoDB,
    updateVariantIntoDB,
    deleteVarintFromDB,
    getProductVariant,
};
exports.default = VariantService;

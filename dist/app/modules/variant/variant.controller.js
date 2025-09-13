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
const multer_s3_uploader_1 = require("../../aws/multer-s3-uploader");
const catchasync_1 = __importDefault(require("../../utilities/catchasync"));
const sendResponse_1 = __importDefault(require("../../utilities/sendResponse"));
const variant_service_1 = __importDefault(require("./variant.service"));
const createVariant = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.variant_image) {
        req.body.images = req.files.variant_image.map((file) => {
            return (0, multer_s3_uploader_1.getCloudFrontUrl)(file.key);
        });
    }
    const result = yield variant_service_1.default.createVariantIntoDB(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Product variant created successfully',
        data: result,
    });
}));
// update variant
const updateVariant = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.variant_image) {
        req.body.newImages = req.files.variant_image.map((file) => {
            return (0, multer_s3_uploader_1.getCloudFrontUrl)(file.key);
        });
    }
    const result = yield variant_service_1.default.updateVariantIntoDB(req.user.profileId, req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product variant updated successfully',
        data: result,
    });
}));
// delete variant
const deleteVariant = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield variant_service_1.default.deleteVarintFromDB(req.user.profileId, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product variant deleted successfully',
        data: result,
    });
}));
// get product variant
const getProductVariant = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield variant_service_1.default.getProductVariant(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product variant retrieved successfully',
        data: result,
    });
}));
const VariantController = {
    createVariant,
    updateVariant,
    deleteVariant,
    getProductVariant,
};
exports.default = VariantController;

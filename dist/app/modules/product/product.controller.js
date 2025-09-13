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
const product_service_1 = __importDefault(require("./product.service"));
const createProduct = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.product_image) {
        req.body.images = req.files.product_image.map((file) => {
            return (0, multer_s3_uploader_1.getCloudFrontUrl)(file.key);
        });
    }
    const result = yield product_service_1.default.createProduct(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Product created successfully',
        data: result,
    });
}));
// const saveProductAsDraft = catchAsync(async (req, res) => {
//   const result = await ProductService.saveProductAsDraftIntoDB(
//     req.user.profileId,
//     req.body,
//     req.files,
//   );
//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'Product save as draft successfully',
//     data: result,
//   });
// });
const publishProductFromDraft = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.product_image) {
        const newImages = req.files.product_image.map((file) => {
            return (0, multer_s3_uploader_1.getCloudFrontUrl)(file.key);
        });
        req.body.images.push(...newImages);
    }
    const result = yield product_service_1.default.publishProductFromDraft(req.user.profileId, req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Publish product from draft successfully',
        data: result,
    });
}));
// delete single publich product
const deleteSingleProduct = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.deleteSingleProduct(req.user.profileId, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product deleted successfully',
        data: result,
    });
}));
// delete single publich product
const softDeleteSingleProduct = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.softDeleteSingleProduct(req.user.profileId, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product deleted permanently',
        data: result,
    });
}));
// change product status
const changeProductStatus = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.changeProductStatus(req.user.profileId, req.params.id, req.body.status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Product is now ${result === null || result === void 0 ? void 0 : result.status}`,
        data: result,
    });
}));
const getAllProduct = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.getAllProduct(req.query, req.user.profileId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Product retrieved successfully`,
        data: result,
    });
}));
const getSingleProduct = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield product_service_1.default.getSingleProductFromDB(req.params.id, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.profileId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Product retrieved successfully`,
        data: result,
    });
}));
const updateProduct = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.product_image) {
        req.body.newImages = req.files.product_image.map((file) => {
            return (0, multer_s3_uploader_1.getCloudFrontUrl)(file.key);
        });
    }
    const result = yield product_service_1.default.updateProductIntoDB(req.user.profileId, req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Product updated successfully`,
        data: result,
    });
}));
const ProductController = {
    createProduct,
    // saveProductAsDraft,
    publishProductFromDraft,
    deleteSingleProduct,
    softDeleteSingleProduct,
    changeProductStatus,
    getAllProduct,
    getSingleProduct,
    updateProduct,
};
exports.default = ProductController;

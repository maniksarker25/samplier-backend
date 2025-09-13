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
const catchasync_1 = __importDefault(require("../../utilities/catchasync"));
const sendResponse_1 = __importDefault(require("../../utilities/sendResponse"));
const bussiness_service_1 = __importDefault(require("./bussiness.service"));
const multer_s3_uploader_1 = require("../../aws/multer-s3-uploader");
const addBussinessInformation = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bussiness_service_1.default.addBussinessInformation(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Bussiness information added successfully',
        data: result,
    });
}));
// add bussiness documents
const addBussinessDocument = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const bussinessLicenseFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.bussinessLicense;
    if ((_b = req.files) === null || _b === void 0 ? void 0 : _b.bussinessLicense) {
        req.body.bussinessLicense = (0, multer_s3_uploader_1.getCloudFrontUrl)(bussinessLicenseFile[0].key);
    }
    const incorparationCertificateFile = (_c = req.files) === null || _c === void 0 ? void 0 : _c.bussinessLicense;
    if ((_d = req.files) === null || _d === void 0 ? void 0 : _d.incorparationCertificate) {
        req.body.incorparationCertificate = (0, multer_s3_uploader_1.getCloudFrontUrl)(incorparationCertificateFile[0].key);
    }
    const result = yield bussiness_service_1.default.addBussinessDocumentIntoDB(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Bussiness document added successfully',
        data: result,
    });
}));
const updateBussinessInfo = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const bussinessLicenseFile: any = req.files?.bussinessLicense;
    // if (req.files?.bussinessLicense) {
    //   req.body.bussinessLicense = getCloudFrontUrl(bussinessLicenseFile[0].key);
    // }
    // const incorparationCertificateFile: any = req.files?.bussinessLicense;
    // if (req.files?.incorparationCertificate) {
    //   req.body.incorparationCertificate = getCloudFrontUrl(
    //     incorparationCertificateFile[0].key,
    //   );
    // }
    // const coverImageFile: any = req.files?.coverImage;
    // if (req.files?.coverImage) {
    //   req.body.coverImage = getCloudFrontUrl(coverImageFile[0].key);
    // }
    // const logo: any = req.files?.logo;
    // if (req.files?.logo) {
    //   req.body.logo = getCloudFrontUrl(logo[0].key);
    // }
    const fileFields = [
        'bussinessLicense',
        'incorparationCertificate',
        'coverImage',
        'logo',
    ];
    fileFields.forEach((field) => {
        var _a;
        const files = (_a = req.files) === null || _a === void 0 ? void 0 : _a[field];
        if (files && files.length > 0) {
            req.body[field] = (0, multer_s3_uploader_1.getCloudFrontUrl)(files[0].key);
        }
    });
    const result = yield bussiness_service_1.default.updateBussinessInfoIntoDB(req.user.profileId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Bussiness updated successfully',
        data: result,
    });
}));
const getBussinessProfile = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bussiness_service_1.default.getBussinessProfile(req.user.profileId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Bussiness profile retrieved successfully',
        data: result,
    });
}));
const BussinessController = {
    addBussinessInformation,
    addBussinessDocument,
    updateBussinessInfo,
    getBussinessProfile,
};
exports.default = BussinessController;

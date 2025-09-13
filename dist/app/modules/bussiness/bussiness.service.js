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
const bussiness_model_1 = __importDefault(require("./bussiness.model"));
const unLinkFile_1 = __importDefault(require("../../helper/unLinkFile"));
const addBussinessInformation = (profileId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const bussiness = yield bussiness_model_1.default.findById(profileId);
    if (!bussiness) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Bussiness not found');
    }
    const result = yield bussiness_model_1.default.findByIdAndUpdate(profileId, Object.assign(Object.assign({}, payload), { isBussinessInfoProvided: true }), {
        new: true,
        runValidators: true,
    });
    return result;
});
const addBussinessDocumentIntoDB = (profileId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const bussiness = yield bussiness_model_1.default.findById(profileId);
    if (!bussiness) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Bussiness not found');
    }
    const result = yield bussiness_model_1.default.findByIdAndUpdate(profileId, Object.assign(Object.assign({}, payload), { isBussinessDocumentProvided: true }), {
        new: true,
        runValidators: true,
    });
    return result;
});
const updateBussinessInfoIntoDB = (bussinessId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const bussiness = yield bussiness_model_1.default.findById(bussinessId);
    if (!bussiness) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Bussiness not found');
    }
    const result = yield bussiness_model_1.default.findByIdAndUpdate(bussinessId, payload, {
        new: true,
        runValidators: true,
    });
    //!TODO : if you use external could for files you need to change here
    if (payload.bussinessLicense) {
        if (bussiness.bussinessLicense) {
            (0, unLinkFile_1.default)(bussiness === null || bussiness === void 0 ? void 0 : bussiness.bussinessLicense);
        }
    }
    if (payload.incorparationCertificate) {
        if (bussiness.incorparationCertificate) {
            (0, unLinkFile_1.default)(bussiness.incorparationCertificate);
        }
    }
    if (payload.coverImage) {
        if (bussiness.coverImage) {
            (0, unLinkFile_1.default)(bussiness.coverImage);
        }
    }
    if (payload.logo) {
        if (bussiness.logo) {
            (0, unLinkFile_1.default)(bussiness.logo);
        }
    }
    return result;
});
const getBussinessProfile = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bussiness_model_1.default.findById(profileId);
    return result;
});
const BussinessService = {
    addBussinessInformation,
    addBussinessDocumentIntoDB,
    updateBussinessInfoIntoDB,
    getBussinessProfile,
};
exports.default = BussinessService;

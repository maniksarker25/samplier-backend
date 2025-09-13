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
const complianceInfo_model_1 = __importDefault(require("./complianceInfo.model"));
const bussiness_model_1 = __importDefault(require("../bussiness/bussiness.model"));
const createComplianceInfo = (profileId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield complianceInfo_model_1.default.create(Object.assign(Object.assign({}, payload), { bussiness: profileId }));
    yield bussiness_model_1.default.findByIdAndUpdate(profileId, { isComplianceInfoProvided: true }, { new: true, runValidators: true });
    return result;
});
const editComplianceInfo = (profileId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const compliance = yield complianceInfo_model_1.default.findOne({
        bussiness: profileId,
        _id: id,
    });
    if (!compliance) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Compliance info not found');
    }
    const result = yield complianceInfo_model_1.default.findOneAndUpdate({ bussiness: profileId, _id: id }, payload, { new: true, runValidators: true });
    return result;
});
const deleteComplianceInfo = (profileId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const compliance = yield complianceInfo_model_1.default.findOne({
        bussiness: profileId,
        _id: id,
    });
    if (!compliance) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Compliance info not found');
    }
    const result = yield complianceInfo_model_1.default.findOneAndDelete({
        bussiness: profileId,
        _id: id,
    });
    return result;
});
const getComplianceInfoForBussiness = (bussinessId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield complianceInfo_model_1.default.find({ bussiness: bussinessId });
    return result;
});
const ComplianceInfoService = {
    createComplianceInfo,
    deleteComplianceInfo,
    editComplianceInfo,
    getComplianceInfoForBussiness,
};
exports.default = ComplianceInfoService;

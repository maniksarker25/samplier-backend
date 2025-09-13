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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../error/appError"));
const return_model_1 = __importDefault(require("./return.model"));
const createReturn = (reviewerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield return_model_1.default.create(Object.assign(Object.assign({}, payload), { reviewer: reviewerId }));
    return result;
});
const getAllReturn = (profileId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const returnQuery = new QueryBuilder_1.default(return_model_1.default.find({ $or: [{ reviewer: profileId }, { bussiness: profileId }] }), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield returnQuery.countTotal();
    const result = yield returnQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const issueRefund = (profileId, returnId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('succssfully issue refund', amount);
    const returnData = yield return_model_1.default.findOne({
        bussiness: profileId,
        _id: returnId,
    });
    if (!returnData) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Return not found');
    }
});
const ReturnService = {
    createReturn,
    getAllReturn,
    issueRefund,
};
exports.default = ReturnService;

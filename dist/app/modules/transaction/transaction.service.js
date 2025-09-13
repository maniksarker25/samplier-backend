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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const transaction_model_1 = __importDefault(require("./transaction.model"));
const getAllTransaction = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionQuery = new QueryBuilder_1.default(transaction_model_1.default.find(), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield transactionQuery.countTotal();
    const result = yield transactionQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getMyTransaction = (profileId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionQuery = new QueryBuilder_1.default(transaction_model_1.default.find({
        $or: [{ paymentReceiver: profileId }, { paymentSender: profileId }],
    }), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield transactionQuery.countTotal();
    const result = yield transactionQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const TransactionService = {
    getAllTransaction,
    getMyTransaction,
};
exports.default = TransactionService;

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
const reviewer_model_1 = __importDefault(require("../review/reviewer.model"));
const reviewReport_model_1 = __importDefault(require("./reviewReport.model"));
const createReviewReport = (profileId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield reviewer_model_1.default.exists({ _id: payload.review });
    if (!review) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    const result = yield reviewReport_model_1.default.create(Object.assign(Object.assign({}, payload), { reporter: profileId }));
    return result;
});
const ReviewReportService = {
    createReviewReport,
};
exports.default = ReviewReportService;

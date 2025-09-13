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
const product_model_1 = __importDefault(require("../product/product.model"));
const bookmark_mode_1 = __importDefault(require("./bookmark.mode"));
const bookmarkAddDelete = (profileId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // check if article exists
    const product = yield product_model_1.default.exists({ _id: productId });
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Profile not found');
    }
    const bookmark = yield bookmark_mode_1.default.exists({
        reviewer: profileId,
        product: productId,
    });
    if (bookmark) {
        yield bookmark_mode_1.default.findOneAndDelete({
            reviewer: profileId,
            product: productId,
        });
        return null;
    }
    else {
        const result = yield bookmark_mode_1.default.create({
            reviewer: profileId,
            product: productId,
        });
        return result;
    }
});
// get bookmark from db
const getMyBookmarkFromDB = (profileId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmarkQuery = new QueryBuilder_1.default(bookmark_mode_1.default.find({ reviewer: profileId }).populate({
        path: 'product',
        select: 'name images price',
    }), query)
        .search([''])
        .fields()
        .filter()
        .paginate()
        .sort();
    const result = yield bookmarkQuery.modelQuery;
    const meta = yield bookmarkQuery.countTotal();
    return {
        meta,
        result,
    };
});
const BookmarkService = {
    bookmarkAddDelete,
    getMyBookmarkFromDB,
};
exports.default = BookmarkService;

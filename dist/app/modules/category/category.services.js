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
const category_model_1 = __importDefault(require("./category.model"));
// create category into db
const createCategoryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.default.create(payload);
    return result;
});
const updateCategoryIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'category not found');
    }
    return result;
});
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.default.find({ isDeleted: false });
    return result;
});
const getSingleCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
    }
    return category;
});
// delete category
const deleteCategoryFromDB = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findById(categoryId);
    if (!category) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
    }
    const result = yield category_model_1.default.findByIdAndUpdate(categoryId, { isDeleted: true }, { new: true, runValidators: true });
    return result;
});
const categoryService = {
    createCategoryIntoDB,
    updateCategoryIntoDB,
    getAllCategories,
    getSingleCategory,
    deleteCategoryFromDB,
};
exports.default = categoryService;

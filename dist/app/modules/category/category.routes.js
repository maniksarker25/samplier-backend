"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_validation_1 = __importDefault(require("./category.validation"));
const category_controller_1 = __importDefault(require("./category.controller"));
const multer_s3_uploader_1 = require("../../aws/multer-s3-uploader");
const router = express_1.default.Router();
router.post('/create-category', (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(category_validation_1.default.createCategoryValidationSchema), category_controller_1.default.createCategory);
router.patch('/update-category/:id', (0, multer_s3_uploader_1.uploadFile)(), (0, validateRequest_1.default)(category_validation_1.default.updateCategoryValidationSchema), category_controller_1.default.updateCategory);
router.get('/all-categories', category_controller_1.default.getAllCategories);
router.get('/get-single-category/:id', category_controller_1.default.getSingleCategory);
router.delete('/delete-category/:id', category_controller_1.default.deleteCategory);
exports.categoryRoutes = router;

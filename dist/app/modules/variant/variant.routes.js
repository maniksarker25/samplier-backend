"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.variantRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_s3_uploader_1 = require("../../aws/multer-s3-uploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const variant_controller_1 = __importDefault(require("./variant.controller"));
const variant_validation_1 = __importDefault(require("./variant.validation"));
const router = express_1.default.Router();
router.post('/create-variant', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(variant_validation_1.default.createVariantValidationSchema), variant_controller_1.default.createVariant);
router.patch('/update-variant/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(variant_validation_1.default.updateVariantValidationSchema), variant_controller_1.default.updateVariant);
// delete variant
router.delete('/delete-variant/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), variant_controller_1.default.deleteVariant);
router.get('/get-product-variant/:id', variant_controller_1.default.getProductVariant);
exports.variantRoutes = router;

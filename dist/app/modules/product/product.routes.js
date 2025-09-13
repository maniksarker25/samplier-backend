"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_s3_uploader_1 = require("../../aws/multer-s3-uploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const simpleAuth_1 = __importDefault(require("../../middlewares/simpleAuth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const product_controller_1 = __importDefault(require("./product.controller"));
const product_validation_1 = __importDefault(require("./product.validation"));
// import { uploadDynamicFile } from '../../helper/dynamicFileUploader';
const router = express_1.default.Router();
router.post('/create-product', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), 
// uploadDynamicFile(),
(0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(product_validation_1.default.createProductValidationSchema), product_controller_1.default.createProduct);
// router.post(
//   '/save-product-as-draft',
//   auth(USER_ROLE.bussinessOwner),
//   uploadFile(),
//   (req: Request, res: Response, next: NextFunction) => {
//     if (req.body.data) {
//       req.body = JSON.parse(req.body.data);
//     }
//     next();
//   },
//   validateRequest(ProductValidations.saveAsDraftProductValidationSchema),
//   ProductController.saveProductAsDraft,
// );
router.post('/publish-product-from-draft/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, 
// validateRequest(ProductValidations.createProductValidationSchema),
product_controller_1.default.publishProductFromDraft);
router.delete('/delete-product/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), product_controller_1.default.deleteSingleProduct);
router.delete('/soft-delete-product/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), product_controller_1.default.softDeleteSingleProduct);
router.patch('/change-status/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, validateRequest_1.default)(product_validation_1.default.changeProductStatusValidationSchema), product_controller_1.default.changeProductStatus);
router.get('/get-all-product', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner, user_constant_1.USER_ROLE.reviewer), product_controller_1.default.getAllProduct);
router.get('/get-single-product/:id', simpleAuth_1.default, product_controller_1.default.getSingleProduct);
router.patch('/update-product/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, product_controller_1.default.updateProduct);
exports.productRoutes = router;

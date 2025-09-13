"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bussinessRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const bussiness_controller_1 = __importDefault(require("./bussiness.controller"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const bussiness_validation_1 = __importDefault(require("./bussiness.validation"));
const multer_s3_uploader_1 = require("../../aws/multer-s3-uploader");
const router = express_1.default.Router();
router.post('/add-bussiness-info', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), bussiness_controller_1.default.addBussinessInformation);
router.post('/add-bussiness-document', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(bussiness_validation_1.default.addBussinessDocumentValidationSchema), bussiness_controller_1.default.addBussinessDocument);
router.patch('/update-bussiness-info', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, bussiness_controller_1.default.updateBussinessInfo);
router.get('/get-profile', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), bussiness_controller_1.default.getBussinessProfile);
exports.bussinessRoutes = router;

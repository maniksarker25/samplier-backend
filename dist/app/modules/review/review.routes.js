"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../helper/fileUploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const review_controller_1 = __importDefault(require("./review.controller"));
const review_validation_1 = __importDefault(require("./review.validation"));
const router = express_1.default.Router();
router.post('/create-review', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, fileUploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(review_validation_1.default.reviewValidationSchema), review_controller_1.default.createReview);
router.get('/get-all-review', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer, user_constant_1.USER_ROLE.bussinessOwner), review_controller_1.default.getAllReview);
router.get('/get-my-reviews', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), review_controller_1.default.getMyReview);
router.get('/get-review-likers/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer, user_constant_1.USER_ROLE.bussinessOwner), review_controller_1.default.getReviewLikers);
router.patch('/like-unlike/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), review_controller_1.default.likeUnlikeReview);
router.get('/get-single-product-review/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer, user_constant_1.USER_ROLE.bussinessOwner), review_controller_1.default.getSingleProductReview);
exports.reviewRoutes = router;

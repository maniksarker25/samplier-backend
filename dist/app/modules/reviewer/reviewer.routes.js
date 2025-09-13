"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const reviewer_validation_1 = __importDefault(require("./reviewer.validation"));
const reviewer_controller_1 = __importDefault(require("./reviewer.controller"));
const multer_s3_uploader_1 = require("../../aws/multer-s3-uploader");
const router = express_1.default.Router();
router.get('/get-profile', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), reviewer_controller_1.default.getReviewerProfile);
router.post('/add-address', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(reviewer_validation_1.default.addAddressValidationSchema), reviewer_controller_1.default.addAddress);
router.post('/add-personal-info', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(reviewer_validation_1.default.addPersonalInfoValidationSchema), reviewer_controller_1.default.addPersonalInfo);
router.post('/add-interested-category', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(reviewer_validation_1.default.addInterestedCategoryValidation), reviewer_controller_1.default.addInterestedCategory);
router.post('/add-currently-share-review', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(reviewer_validation_1.default.addCurrentlyShareReviewValidationSchema), reviewer_controller_1.default.addCurrentlyShareReview);
router.post('/add-social-info', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), reviewer_controller_1.default.addSocailInfo);
router.patch('/update-reviewer-profile', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, reviewer_controller_1.default.updateReviewerIntoDB);
router.patch('/update-reviewer-profile', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer));
router.post('/make-skip', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, validateRequest_1.default)(reviewer_validation_1.default.makeSkipValidationSchema), reviewer_controller_1.default.makeSkip);
router.post('/follow-unfollow-reviewer/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), reviewer_controller_1.default.followUnfollowReviewer);
router.post('/follow-unfollow-bussiness/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), reviewer_controller_1.default.followUnfollowBussiness);
exports.reviewerRoutes = router;

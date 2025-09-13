"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_s3_uploader_1 = require("../../aws/multer-s3-uploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const comment_controller_1 = __importDefault(require("./comment.controller"));
const comment_validation_1 = __importDefault(require("./comment.validation"));
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(comment_validation_1.default.createCommentSchema), comment_controller_1.default.createComment);
router.post('/create-reply', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(comment_validation_1.default.createReplySchema), comment_controller_1.default.createReply);
router.patch('/update-comment/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(comment_validation_1.default.updateCommentValidationSchema), comment_controller_1.default.updateComment);
router.delete('/delete-comment/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), comment_controller_1.default.deleteComment);
router.post('/like-unlike/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), comment_controller_1.default.likeUnlikeComment);
router.get('/get-review-comments/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), comment_controller_1.default.getReviewComments);
router.get('/get-my-comments', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), comment_controller_1.default.getMyComments);
router.get('/get-replies/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), comment_controller_1.default.getReplies);
router.get('/get-likers/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), comment_controller_1.default.getAllLikersForComment);
router.get('/get-my-likes', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), comment_controller_1.default.getMyLikes);
exports.commentRoutes = router;

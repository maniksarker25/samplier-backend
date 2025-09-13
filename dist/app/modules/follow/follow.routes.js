"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const follow_controller_1 = __importDefault(require("./follow.controller"));
const router = express_1.default.Router();
router.post('/follow-unfollow/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), follow_controller_1.default.followUnfollowUser);
router.get('/followers', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), follow_controller_1.default.getFollowers);
router.get('/following', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), follow_controller_1.default.getFollowing);
exports.followRoutes = router;
